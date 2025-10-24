'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/helpers'

interface Step {
  id: string
  name: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: string
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <li key={step.id} className="relative flex-1">
              {/* Connector Line */}
              {index !== 0 && (
                <div
                  className={cn(
                    'absolute left-0 top-5 -ml-px h-0.5 w-full',
                    isComplete || isCurrent ? 'bg-primary-500' : 'bg-gray-200'
                  )}
                  style={{ left: '-50%' }}
                />
              )}

              <div className="group relative flex flex-col items-center">
                {/* Circle */}
                <div className="relative z-10">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                      isComplete && 'border-primary-500 bg-primary-500',
                      isCurrent && 'border-primary-500 bg-white',
                      isUpcoming && 'border-gray-200 bg-white'
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isCurrent && 'text-primary-600',
                          isUpcoming && 'text-gray-400'
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="mt-3 text-center hidden sm:block">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isCurrent && 'text-primary-600',
                      isComplete && 'text-gray-900',
                      isUpcoming && 'text-gray-500'
                    )}
                  >
                    {step.name}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 hidden md:block">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
