'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cardSocialSchema, type CardSocial } from '@/lib/validations/schemas'
import { useWizard } from '@/lib/hooks/use-wizard'
import { Linkedin, Instagram, Twitter, Facebook, Github, Youtube } from 'lucide-react'

export function StepSocial() {
  const { cardData, updateCardData, nextStep, previousStep } = useWizard()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardSocial>({
    resolver: zodResolver(cardSocialSchema),
    defaultValues: {
      linkedin: cardData.social_links?.linkedin || '',
      instagram: cardData.social_links?.instagram || '',
      twitter: cardData.social_links?.twitter || '',
      facebook: cardData.social_links?.facebook || '',
      github: cardData.social_links?.github || '',
      youtube: cardData.social_links?.youtube || '',
    },
  })

  const onSubmit = (data: CardSocial) => {
    updateCardData({ social_links: data })
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Social Media Links
        </h2>
        <p className="text-gray-600">
          Connect your social profiles (all optional)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <input
                {...register('linkedin')}
                type="url"
                placeholder="https://linkedin.com/in/username"
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.linkedin && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>
            )}
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <input
                {...register('instagram')}
                type="text"
                placeholder="@username or full URL"
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.instagram && (
              <p className="mt-1 text-sm text-red-600">{errors.instagram.message}</p>
            )}
          </div>

          {/* Twitter/X */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter / X
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <input
                {...register('twitter')}
                type="text"
                placeholder="@username or full URL"
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.twitter && (
              <p className="mt-1 text-sm text-red-600">{errors.twitter.message}</p>
            )}
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Facebook className="w-5 h-5 text-white" />
              </div>
              <input
                {...register('facebook')}
                type="url"
                placeholder="https://facebook.com/username"
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.facebook && (
              <p className="mt-1 text-sm text-red-600">{errors.facebook.message}</p>
            )}
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <input
                {...register('github')}
                type="url"
                placeholder="https://github.com/username"
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.github && (
              <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>
            )}
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <input
                {...register('youtube')}
                type="url"
                placeholder="https://youtube.com/@username"
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition"
              />
            </div>
            {errors.youtube && (
              <p className="mt-1 text-sm text-red-600">{errors.youtube.message}</p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-4">
          <p className="text-sm text-primary-800">
            <strong>💡 Tip:</strong> Add only the platforms where you're most active. You can always add more later!
          </p>
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
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                updateCardData({ social_links: {} })
                nextStep()
              }}
              className="text-gray-600 hover:text-gray-900 font-medium px-6 py-3"
            >
              Skip
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Continue →
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
