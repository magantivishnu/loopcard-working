'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cardBasicInfoSchema, type CardBasicInfo } from '@/lib/validations/schemas'
import { useWizard } from '@/lib/hooks/use-wizard'
import { User, Briefcase, Building2, FileText } from 'lucide-react'

export function StepBasicInfo() {
  const { cardData, updateCardData, nextStep, previousStep } = useWizard()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardBasicInfo>({
    resolver: zodResolver(cardBasicInfoSchema),
    defaultValues: {
      full_name: cardData.full_name || '',
      business_name: cardData.business_name || '',
      designation: cardData.designation || '',
      tagline: cardData.tagline || '',
      template_type: cardData.template_type || 'individual',
    },
  })

  const onSubmit = (data: CardBasicInfo) => {
    updateCardData(data)
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600">
          This information will appear on your digital card
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('full_name')}
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('business_name')}
                type="text"
                placeholder="Your Company or Freelance"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.business_name && (
              <p className="mt-1 text-sm text-red-600">{errors.business_name.message}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation/Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                {...register('designation')}
                type="text"
                placeholder="Product Designer"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.designation && (
              <p className="mt-1 text-sm text-red-600">{errors.designation.message}</p>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline/About
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                {...register('tagline')}
                rows={3}
                placeholder="A short description about what you do..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition resize-none"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">120 characters max</p>
            {errors.tagline && (
              <p className="mt-1 text-sm text-red-600">{errors.tagline.message}</p>
            )}
          </div>

          {/* Template Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Template
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="relative cursor-pointer">
                <input
                  {...register('template_type')}
                  type="radio"
                  value="individual"
                  className="peer sr-only"
                />
                <div className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-primary-500 transition peer-checked:border-primary-500 peer-checked:bg-primary-50">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Individual</p>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  {...register('template_type')}
                  type="radio"
                  value="freelancer"
                  className="peer sr-only"
                />
                <div className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-primary-500 transition peer-checked:border-primary-500 peer-checked:bg-primary-50">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Freelancer</p>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  {...register('template_type')}
                  type="radio"
                  value="business"
                  className="peer sr-only"
                />
                <div className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-primary-500 transition peer-checked:border-primary-500 peer-checked:bg-primary-50">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Building2 className="w-6 h-6 text-pink-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Business</p>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  {...register('template_type')}
                  type="radio"
                  value="enterprise"
                  className="peer sr-only"
                />
                <div className="border-2 border-gray-200 rounded-xl p-4 text-center hover:border-primary-500 transition peer-checked:border-primary-500 peer-checked:bg-primary-50">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Enterprise</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={previousStep}
            className="text-gray-600 hover:text-gray-900 font-medium px-6 py-3"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  )
}
