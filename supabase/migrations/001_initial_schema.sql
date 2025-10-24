-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'small_business', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID,
  
  -- Unique slug for URL
  slug TEXT UNIQUE NOT NULL,
  template_type TEXT DEFAULT 'individual' CHECK (template_type IN ('individual', 'freelancer', 'business', 'enterprise')),
  
  -- Profile Data
  profile_image_url TEXT,
  full_name TEXT NOT NULL,
  business_name TEXT,
  designation TEXT,
  tagline TEXT,
  about TEXT,
  
  -- Contact Info
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  
  -- Social Links (JSONB for flexibility)
  social_links JSONB DEFAULT '{}'::jsonb,
  
  -- Customization
  theme JSONB DEFAULT '{"colorScheme": "default", "font": "inter"}'::jsonb,
  custom_css TEXT,
  logo_url TEXT,
  background_url TEXT,
  
  -- Gallery
  gallery_images JSONB DEFAULT '[]'::jsonb,
  
  -- Settings
  field_visibility JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_private BOOLEAN DEFAULT false,
  password_hash TEXT,
  seo_title TEXT,
  seo_description TEXT,
  
  -- Analytics counters
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create QR codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  qr_image_url TEXT NOT NULL,
  qr_style JSONB DEFAULT '{}'::jsonb,
  is_dynamic BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'scan', 'download_vcard', 'share')),
  
  -- Event Details
  element_id TEXT,
  referrer TEXT,
  
  -- Visitor Info
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  
  -- Location
  country TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  
  -- Session
  session_id UUID,
  is_unique_visitor BOOLEAN DEFAULT false,
  time_spent_seconds INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_card_id ON analytics_events(card_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for cards
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON cards
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public cards are viewable by anyone" ON cards
  FOR SELECT USING (is_active = true AND is_private = false);

-- RLS Policies for QR codes
CREATE POLICY "Users can view own QR codes" ON qr_codes
  FOR SELECT USING (
    card_id IN (SELECT id FROM cards WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create QR codes for own cards" ON qr_codes
  FOR INSERT WITH CHECK (
    card_id IN (SELECT id FROM cards WHERE user_id = auth.uid())
  );

-- RLS Policies for analytics (read-only for card owners)
CREATE POLICY "Card owners can view analytics" ON analytics_events
  FOR SELECT USING (
    card_id IN (SELECT id FROM cards WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment card views
CREATE OR REPLACE FUNCTION increment_card_views(card_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE cards SET total_views = total_views + 1 WHERE id = card_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default card templates (optional)
-- You can add pre-designed templates here
