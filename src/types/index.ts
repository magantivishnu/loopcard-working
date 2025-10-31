export interface Card {
  id: string;
  user_id: string;
  slug: string;
  full_name: string;
  business_name?: string;
  role?: string;
  tagline?: string;
  photo_url?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  view_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}