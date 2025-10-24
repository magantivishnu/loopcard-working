import { z } from 'zod'

export const cardBasicInfoSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  business_name: z.string().max(100).optional(),
  designation: z.string().min(2, 'Designation is required').max(100),
  tagline: z.string().max(120).optional(),
  about: z.string().max(500).optional(),
  template_type: z.enum(['individual', 'freelancer', 'business', 'enterprise']).default('individual'),
})

export const cardContactSchema = z.object({
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number').optional().or(z.literal('')),
  whatsapp: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Invalid WhatsApp number').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  address: z.string().max(200).optional(),
})

export const cardSocialSchema = z.object({
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  youtube: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
  tiktok: z.string().optional(),
})

export const cardThemeSchema = z.object({
  colorScheme: z.enum(['default', 'blue', 'purple', 'pink', 'green', 'orange']).default('default'),
  font: z.enum(['inter', 'roboto', 'poppins', 'playfair']).default('inter'),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
})

export const cardVisibilitySchema = z.object({
  phone: z.boolean().default(true),
  whatsapp: z.boolean().default(true),
  email: z.boolean().default(true),
  website: z.boolean().default(true),
  address: z.boolean().default(false),
  social_links: z.boolean().default(true),
})

export const createCardSchema = cardBasicInfoSchema.merge(cardContactSchema).extend({
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  social_links: cardSocialSchema.optional(),
  theme: cardThemeSchema.optional(),
  field_visibility: cardVisibilitySchema.optional(),
  profile_image_url: z.string().url().optional(),
})

export const updateCardSchema = createCardSchema.partial()

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type CardBasicInfo = z.infer<typeof cardBasicInfoSchema>
export type CardContact = z.infer<typeof cardContactSchema>
export type CardSocial = z.infer<typeof cardSocialSchema>
export type CardTheme = z.infer<typeof cardThemeSchema>
export type CardVisibility = z.infer<typeof cardVisibilitySchema>
export type CreateCard = z.infer<typeof createCardSchema>
export type UpdateCard = z.infer<typeof updateCardSchema>
export type SignUp = z.infer<typeof signUpSchema>
export type SignIn = z.infer<typeof signInSchema>
