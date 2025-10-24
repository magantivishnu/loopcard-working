-- LoopCard Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'small_business', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations (for Small Business and Enterprise)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  brand_colors JSONB DEFAULT '{"primary": "#6366f1", "secondary": "#8b5cf6"}',
  custom_domain TEXT UNIQUE,
  plan_type TEXT DEFAULT 'small_business' CHECK (plan_type IN ('small_business', 'enterprise')),
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization members
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Digital Cards
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Basic Info
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
  social_links JSONB DEFAULT '{}',
  
  -- Customization
  theme JSONB DEFAULT '{"colorScheme": "default", "font": "inter"}',
  custom_css TEXT,
  logo_url TEXT,
  background_url TEXT,
  
  -- Gallery
  gallery_images JSONB DEFAULT '[]',
  
  -- Settings
  field_visibility JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_private BOOLEAN DEFAULT false,
  password_hash TEXT,
  seo_title TEXT,
  seo_description TEXT,
  
  -- Analytics
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Codes
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  qr_image_url TEXT NOT NULL,
  qr_style JSONB DEFAULT '{}',
  is_dynamic BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
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

-- Lead Captures (Pro feature)
CREATE TABLE IF NOT EXISTS lead_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  
  -- Lead Data
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  message TEXT,
  custom_fields JSONB DEFAULT '{}',
  
  -- Engagement Score (AI-generated)
  engagement_score INTEGER CHECK (engagement_score >= 0 AND engagement_score <= 100),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Card Templates
CREATE TABLE IF NOT EXISTS card_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('individual', 'freelancer', 'business', 'enterprise')),
  preview_image_url TEXT,
  theme_config JSONB NOT NULL,
  default_fields JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_organization_id ON cards(organization_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_card_id ON analytics_events(card_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_lead_captures_card_id ON lead_captures(card_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Cards
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id OR is_private = false);

CREATE POLICY "Users can create cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON cards
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public cards are viewable by anyone" ON cards
  FOR SELECT USING (is_active = true AND is_private = false);

-- RLS Policies for Analytics
CREATE POLICY "Card owners can view analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cards WHERE cards.id = analytics_events.card_id AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can track events" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- RLS Policies for Lead Captures
CREATE POLICY "Card owners can view leads" ON lead_captures
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cards WHERE cards.id = lead_captures.card_id AND cards.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can submit leads" ON lead_captures
  FOR INSERT WITH CHECK (true);

-- RLS Policies for QR Codes
CREATE POLICY "Card owners can manage QR codes" ON qr_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM cards WHERE cards.id = qr_codes.card_id AND cards.user_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION increment_card_views(card_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE cards SET total_views = total_views + 1 WHERE id = card_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert some default templates
INSERT INTO card_templates (name, description, category, theme_config, default_fields, is_premium) VALUES
('Classic Individual', 'Clean and professional template for individuals', 'individual', 
 '{"colorScheme": "default", "font": "inter"}',
 '{"fields": ["full_name", "designation", "phone", "email", "social_links"]}',
 false),
('Creative Freelancer', 'Bold and colorful template for creatives', 'freelancer',
 '{"colorScheme": "purple", "font": "poppins"}',
 '{"fields": ["full_name", "tagline", "phone", "email", "website", "social_links", "gallery"]}',
 false),
('Corporate Business', 'Professional template for businesses', 'business',
 '{"colorScheme": "blue", "font": "inter"}',
 '{"fields": ["full_name", "business_name", "designation", "phone", "email", "website", "address"]}',
 false),
('Enterprise Suite', 'Comprehensive template with all features', 'enterprise',
 '{"colorScheme": "custom", "font": "roboto"}',
 '{"fields": ["full_name", "business_name", "designation", "tagline", "about", "phone", "whatsapp", "email", "website", "address", "social_links", "gallery"]}',
 true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'LoopCard database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Set up storage buckets in Supabase Dashboard';
  RAISE NOTICE '2. Enable authentication providers';
  RAISE NOTICE '3. Update your .env file with Supabase credentials';
END $$;
