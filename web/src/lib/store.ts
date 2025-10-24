import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Profile, Card, Toast } from '../types'

interface AppState {
  // Auth
  user: Profile | null
  session: any | null
  isLoading: boolean
  setUser: (user: Profile | null) => void
  setSession: (session: any | null) => void
  setLoading: (loading: boolean) => void
  
  // Cards
  cards: Card[]
  activeCard: Card | null
  setCards: (cards: Card[]) => void
  setActiveCard: (card: Card | null) => void
  addCard: (card: Card) => void
  updateCard: (cardId: string, updates: Partial<Card>) => void
  deleteCard: (cardId: string) => void
  
  // UI State
  toasts: Toast[]
  sidebarOpen: boolean
  showToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  setSidebarOpen: (open: boolean) => void
  
  // Setup Wizard
  setupStep: number
  setupData: any
  setSetupStep: (step: number) => void
  setSetupData: (data: any) => void
  resetSetupData: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      session: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      
      // Cards
      cards: [],
      activeCard: null,
      setCards: (cards) => set({ cards }),
      setActiveCard: (activeCard) => set({ activeCard }),
      addCard: (card) => set((state) => ({ cards: [card, ...state.cards] })),
      updateCard: (cardId, updates) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === cardId ? { ...c, ...updates } : c
          ),
          activeCard:
            state.activeCard?.id === cardId
              ? { ...state.activeCard, ...updates }
              : state.activeCard,
        })),
      deleteCard: (cardId) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== cardId),
          activeCard: state.activeCard?.id === cardId ? null : state.activeCard,
        })),
      
      // UI State
      toasts: [],
      sidebarOpen: false,
      showToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            {
              ...toast,
              id: Math.random().toString(36).substr(2, 9),
            },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      
      // Setup Wizard
      setupStep: 1,
      setupData: {},
      setSetupStep: (setupStep) => set({ setupStep }),
      setSetupData: (data) =>
        set((state) => ({
          setupData: { ...state.setupData, ...data },
        })),
      resetSetupData: () => set({ setupStep: 1, setupData: {} }),
    }),
    {
      name: 'loopcard-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
)
