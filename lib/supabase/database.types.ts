export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan_type?: 'free' | 'pro' | 'small_business' | 'enterprise'
          plan_expires_at?: string | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan_type?: 'free' | 'pro' | 'small_business' | 'enterprise'
          plan_expires_at?: string | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          user_id: string
          organization_id: string | null
          slug: string
          template_type: 'individual' | 'freelancer' | 'business' | 'enterprise'
          profile_image_url: string | null
          full_name: string
          business_name: string | null
          designation: string | null
          tagline: string | null
          about: string | null
          phone: string | null
          whatsapp: string | null
          email: string | null
          website: string | null
          address: string | null
          social_links: Json
          theme: Json
          custom_css: string | null
          logo_url: string | null
          background_url: string | null
          gallery_images: Json
          field_visibility: Json
          is_active: boolean
          is_private: boolean
          password_hash: string | null
          seo_title: string | null
          seo_description: string | null
          total_views: number
          unique_views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id?: string | null
          slug: string
          template_type?: 'individual' | 'freelancer' | 'business' | 'enterprise'
          profile_image_url?: string | null
          full_name: string
          business_name?: string | null
          designation?: string | null
          tagline?: string | null
          about?: string | null
          phone?: string | null
          whatsapp?: string | null
          email?: string | null
          website?: string | null
          address?: string | null
          social_links?: Json
          theme?: Json
          custom_css?: string | null
          logo_url?: string | null
          background_url?: string | null
          gallery_images?: Json
          field_visibility?: Json
          is_active?: boolean
          is_private?: boolean
          password_hash?: string | null
          seo_title?: string | null
          seo_description?: string | null
          total_views?: number
          unique_views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string | null
          slug?: string
          template_type?: 'individual' | 'freelancer' | 'business' | 'enterprise'
          profile_image_url?: string | null
          full_name?: string
          business_name?: string | null
          designation?: string | null
          tagline?: string | null
          about?: string | null
          phone?: string | null
          whatsapp?: string | null
          email?: string | null
          website?: string | null
          address?: string | null
          social_links?: Json
          theme?: Json
          custom_css?: string | null
          logo_url?: string | null
          background_url?: string | null
          gallery_images?: Json
          field_visibility?: Json
          is_active?: boolean
          is_private?: boolean
          password_hash?: string | null
          seo_title?: string | null
          seo_description?: string | null
          total_views?: number
          unique_views?: number
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          card_id: string
          event_type: 'view' | 'click' | 'scan' | 'download_vcard' | 'share'
          element_id: string | null
          referrer: string | null
          ip_address: string | null
          user_agent: string | null
          device_type: string | null
          browser: string | null
          os: string | null
          country: string | null
          city: string | null
          latitude: number | null
          longitude: number | null
          session_id: string | null
          is_unique_visitor: boolean
          time_spent_seconds: number | null
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          event_type: 'view' | 'click' | 'scan' | 'download_vcard' | 'share'
          element_id?: string | null
          referrer?: string | null
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          session_id?: string | null
          is_unique_visitor?: boolean
          time_spent_seconds?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          event_type?: 'view' | 'click' | 'scan' | 'download_vcard' | 'share'
          element_id?: string | null
          referrer?: string | null
          ip_address?: string | null
          user_agent?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          country?: string | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          session_id?: string | null
          is_unique_visitor?: boolean
          time_spent_seconds?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
