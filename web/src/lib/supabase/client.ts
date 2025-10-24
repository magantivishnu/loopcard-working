import { createClient } from '@supabase/supabase-js'
import { Database } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please add them to your .env file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  },

  signInWithPassword: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  signInWithOAuth: async (provider: 'google' | 'apple') => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  signInWithOtp: async (email: string) => {
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  verifyOtp: async (email: string, token: string) => {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  getCurrentSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Database helpers
export const db = {
  // Profiles
  getProfile: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  },

  updateProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
  },

  // Cards
  getCard: async (slug: string) => {
    return await supabase
      .from('cards')
      .select('*')
      .eq('slug', slug)
      .single()
  },

  getCardById: async (cardId: string) => {
    return await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single()
  },

  getUserCards: async (userId: string) => {
    return await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  createCard: async (cardData: any) => {
    return await supabase
      .from('cards')
      .insert(cardData)
      .select()
      .single()
  },

  updateCard: async (cardId: string, updates: any) => {
    return await supabase
      .from('cards')
      .update(updates)
      .eq('id', cardId)
  },

  deleteCard: async (cardId: string) => {
    return await supabase
      .from('cards')
      .delete()
      .eq('id', cardId)
  },

  // Analytics
  trackEvent: async (eventData: any) => {
    return await supabase
      .from('analytics_events')
      .insert(eventData)
  },

  getCardAnalytics: async (cardId: string, startDate?: string, endDate?: string) => {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('card_id', cardId)

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    return await query.order('created_at', { ascending: false })
  },

  incrementCardViews: async (cardId: string) => {
    return await supabase.rpc('increment_card_views', { card_uuid: cardId })
  },

  // Lead Captures
  createLeadCapture: async (leadData: any) => {
    return await supabase
      .from('lead_captures')
      .insert(leadData)
      .select()
      .single()
  },

  getCardLeads: async (cardId: string) => {
    return await supabase
      .from('lead_captures')
      .select('*')
      .eq('card_id', cardId)
      .order('created_at', { ascending: false })
  },
}

// Storage helpers
export const storage = {
  uploadAvatar: async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return publicUrl
  },

  uploadCardImage: async (cardId: string, file: File, type: 'profile' | 'gallery' | 'background') => {
    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const fileName = `${cardId}/${type}-${timestamp}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('card-images')
      .getPublicUrl(fileName)

    return publicUrl
  },

  deleteImage: async (bucket: string, path: string) => {
    return await supabase.storage
      .from(bucket)
      .remove([path])
  },
}
