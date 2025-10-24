'use client'

import { useWizard } from '@/lib/hooks/use-wizard'
import { StepIndicator } from '@/components/cards/step-indicator'
import { StepPhoto } from '@/components/cards/step-photo'
import { StepBasicInfo } from '@/components/cards/step-basic-info'
import { StepContact } from '@/components/cards/step-contact'
import { StepSocial } from '@/components/cards/step-social'
import { StepPreview } from '@/components/cards/step-preview'

const steps = [
  { id: 'photo', name: 'Photo', description: 'Upload your image' },
  { id: 'basic', name: 'Info', description: 'Basic details' },
  { id: 'contact', name: 'Contact', description: 'How to reach you' },
  { id: 'social', name: 'Social', description: 'Social profiles' },
  { id: 'preview', name: 'Preview', description: 'Review & save' },
]

export default function NewCardPage() {
  const { currentStep } = useWizard()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Digital Business Card
          </h1>
          <p className="text-gray-600">
            Follow the steps below to build your card
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="mb-20">
          {currentStep === 'photo' && <StepPhoto />}
          {currentStep === 'basic' && <StepBasicInfo />}
          {currentStep === 'contact' && <StepContact />}
          {currentStep === 'social' && <StepSocial />}
          {currentStep === 'preview' && <StepPreview />}
        </div>
      </div>
    </div>
  )
}
