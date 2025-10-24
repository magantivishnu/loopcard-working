// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      cards: {
        Row: Card
        Insert: Omit<Card, 'id' | 'created_at' | 'updated_at' | 'total_views' | 'unique_views'>
        Update: Partial<Omit<Card, 'id' | 'created_at' | 'updated_at'>>
      }
      organizations: {
        Row: Organization
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>
      }
      analytics_events: {
        Row: AnalyticsEvent
        Insert: Omit<AnalyticsEvent, 'id' | 'created_at'>
        Update: never
      }
      lead_captures: {
        Row: LeadCapture
        Insert: Omit<LeadCapture, 'id' | 'created_at'>
        Update: Partial<Omit<LeadCapture, 'id' | 'created_at'>>
      }
    }
  }
}

// User Profile
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan_type: 'free' | 'pro' | 'small_business' | 'enterprise'
  plan_expires_at: string | null
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

// Organization
export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  brand_colors: BrandColors | null
  custom_domain: string | null
  plan_type: 'small_business' | 'enterprise'
  owner_id: string
  settings: OrganizationSettings
  created_at: string
  updated_at: string
}

export interface BrandColors {
  primary: string
  secondary: string
}

export interface OrganizationSettings {
  locked_fields?: string[]
  custom_css?: string
  [key: string]: any
}

// Digital Card
export interface Card {
  id: string
  user_id: string
  organization_id: string | null
  
  // Basic Info
  slug: string
  template_type: 'individual' | 'freelancer' | 'business' | 'enterprise'
  
  // Profile Data
  profile_image_url: string | null
  full_name: string
  business_name: string | null
  designation: string | null
  tagline: string | null
  about: string | null
  
  // Contact Info
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  address: string | null
  
  // Social Links
  social_links: SocialLinks
  
  // Customization
  theme: CardTheme
  custom_css: string | null
  logo_url: string | null
  background_url: string | null
  
  // Gallery
  gallery_images: string[]
  
  // Settings
  field_visibility: FieldVisibility
  is_active: boolean
  is_private: boolean
  password_hash: string | null
  seo_title: string | null
  seo_description: string | null
  
  // Analytics
  total_views: number
  unique_views: number
  
  created_at: string
  updated_at: string
}

export interface SocialLinks {
  linkedin?: string
  instagram?: string
  twitter?: string
  facebook?: string
  github?: string
  youtube?: string
  tiktok?: string
  [key: string]: string | undefined
}

export interface CardTheme {
  colorScheme: 'default' | 'purple' | 'blue' | 'pink' | 'green' | 'custom'
  primaryColor?: string
  secondaryColor?: string
  font: 'inter' | 'roboto' | 'poppins'
}

export interface FieldVisibility {
  phone?: boolean
  whatsapp?: boolean
  email?: boolean
  website?: boolean
  address?: boolean
  social_links?: boolean
  gallery?: boolean
  [key: string]: boolean | undefined
}

// Analytics
export interface AnalyticsEvent {
  id: string
  card_id: string
  event_type: 'view' | 'click' | 'scan' | 'download_vcard' | 'share'
  element_id: string | null
  referrer: string | null
  
  // Visitor Info
  ip_address: string | null
  user_agent: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  
  // Location
  country: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  
  // Session
  session_id: string | null
  is_unique_visitor: boolean
  time_spent_seconds: number | null
  
  created_at: string
}

// Lead Capture
export interface LeadCapture {
  id: string
  card_id: string
  name: string | null
  email: string | null
  phone: string | null
  company: string | null
  message: string | null
  custom_fields: Record<string, any>
  engagement_score: number | null
  created_at: string
}

// Analytics Summary
export interface AnalyticsSummary {
  total_views: number
  unique_views: number
  total_clicks: number
  total_scans: number
  average_time_spent: number
  top_countries: CountryStat[]
  top_referrers: ReferrerStat[]
  device_breakdown: DeviceBreakdown
  click_heatmap: ClickHeatmap[]
}

export interface CountryStat {
  country: string
  count: number
  percentage: number
}

export interface ReferrerStat {
  referrer: string
  count: number
  percentage: number
}

export interface DeviceBreakdown {
  mobile: number
  tablet: number
  desktop: number
}

export interface ClickHeatmap {
  element_id: string
  clicks: number
  percentage: number
}

// Form Types
export interface SetupWizardData {
  step1: {
    profile_photo?: File | null
  }
  step2: {
    full_name: string
    business_name?: string
    designation: string
    tagline?: string
    template_type: 'individual' | 'freelancer' | 'business' | 'enterprise'
  }
  step3: {
    phone: string
    whatsapp?: string
    email: string
    website?: string
    address?: string
  }
  step4: {
    social_links: SocialLinks
  }
}

export interface CardFormData {
  full_name: string
  business_name?: string
  designation?: string
  tagline?: string
  about?: string
  phone?: string
  whatsapp?: string
  email?: string
  website?: string
  address?: string
  social_links: SocialLinks
  field_visibility: FieldVisibility
  template_type: 'individual' | 'freelancer' | 'business' | 'enterprise'
}

// Auth Types
export interface AuthState {
  user: Profile | null
  session: any | null
  loading: boolean
}

// UI Types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export interface Modal {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  onClose?: () => void
}
