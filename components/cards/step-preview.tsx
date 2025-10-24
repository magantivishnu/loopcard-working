'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useWizard } from '@/lib/hooks/use-wizard'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface StepPreviewProps {
  isEditMode?: boolean
  cardId?: string
}

export function StepPreview({ isEditMode = false, cardId }: StepPreviewProps) {
  const router = useRouter()
  const supabase = createClient()
  const { cardData } = useWizard()
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/signin')
        return
      }

      if (isEditMode && cardId) {
        const { error } = await supabase
          .from('cards')
          .update({
            profile_image_url: cardData.profile_image_url,
            full_name: cardData.full_name,
            business_name: cardData.business_name,
            designation: cardData.designation,
            tagline: cardData.tagline,
            template_type: cardData.template_type,
            phone: cardData.phone,
            whatsapp: cardData.whatsapp,
            email: cardData.email,
            website: cardData.website,
            address: cardData.address,
            social_links: cardData.social_links,
            field_visibility: cardData.field_visibility,
          })
          .eq('id', cardId)
          .eq('user_id', user.id)

        if (error) {
          setSaveError('Failed to update card')
          return
        }

        router.push('/dashboard/cards')
        
      } else {
        const slug = (cardData.full_name || 'card')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()

        const { error } = await supabase
          .from('cards')
          .insert({
            user_id: user.id,
            slug,
            profile_image_url: cardData.profile_image_url,
            full_name: cardData.full_name,
            business_name: cardData.business_name,
            designation: cardData.designation,
            tagline: cardData.tagline,
            template_type: cardData.template_type,
            phone: cardData.phone,
            whatsapp: cardData.whatsapp,
            email: cardData.email,
            website: cardData.website,
            address: cardData.address,
            social_links: cardData.social_links,
            field_visibility: cardData.field_visibility,
            is_active: true,
          })

        if (error) {
          setSaveError('Failed to create card')
          return
        }

        router.push('/dashboard/cards')
      }

    } catch (err) {
      setSaveError('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Review Your Changes' : 'Preview Your Card'}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-bold">{cardData.full_name}</h3>
          <p className="text-gray-600">{cardData.designation}</p>
          <p className="text-gray-500 text-sm mt-2">{cardData.business_name}</p>
        </div>
      </div>

      {saveError && (
        <div className="mb-6 bg-red-50 p-4 rounded">
          <p className="text-red-800 text-center">{saveError}</p>
        </div>
      )}

      <div className="text-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>{isEditMode ? 'Save Changes' : 'Create Card'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}