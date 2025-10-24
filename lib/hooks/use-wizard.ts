import { create } from 'zustand'

export type WizardStep = 'photo' | 'basic' | 'contact' | 'social' | 'preview'

interface CardData {
  // Photo
  profile_image_url?: string
  
  // Basic Info
  full_name: string
  business_name?: string
  designation: string
  tagline?: string
  template_type: 'individual' | 'freelancer' | 'business' | 'enterprise'
  
  // Contact
  phone?: string
  whatsapp?: string
  email: string
  website?: string
  address?: string
  
  // Social
  social_links?: {
    linkedin?: string
    instagram?: string
    twitter?: string
    facebook?: string
    github?: string
    youtube?: string
  }
  
  // Visibility
  field_visibility?: {
    phone: boolean
    whatsapp: boolean
    email: boolean
    website: boolean
    address: boolean
    social_links: boolean
  }
}

interface WizardState {
  currentStep: WizardStep
  cardData: Partial<CardData>
  isLoading: boolean
  error: string | null
  
  // Actions
  setStep: (step: WizardStep) => void
  nextStep: () => void
  previousStep: () => void
  updateCardData: (data: Partial<CardData>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const steps: WizardStep[] = ['photo', 'basic', 'contact', 'social', 'preview']

export const useWizard = create<WizardState>((set, get) => ({
  currentStep: 'photo',
  cardData: {
    template_type: 'individual',
    field_visibility: {
      phone: true,
      whatsapp: true,
      email: true,
      website: true,
      address: false,
      social_links: true,
    },
  },
  isLoading: false,
  error: null,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const currentIndex = steps.indexOf(get().currentStep)
    if (currentIndex < steps.length - 1) {
      set({ currentStep: steps[currentIndex + 1] })
    }
  },

  previousStep: () => {
    const currentIndex = steps.indexOf(get().currentStep)
    if (currentIndex > 0) {
      set({ currentStep: steps[currentIndex - 1] })
    }
  },

  updateCardData: (data) =>
    set((state) => ({
      cardData: { ...state.cardData, ...data },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      currentStep: 'photo',
      cardData: {
        template_type: 'individual',
        field_visibility: {
          phone: true,
          whatsapp: true,
          email: true,
          website: true,
          address: false,
          social_links: true,
        },
      },
      isLoading: false,
      error: null,
    }),
}))
