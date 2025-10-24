'use client'

import { useState } from 'react'
import { Camera, Upload, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useWizard } from '@/lib/hooks/use-wizard'

export function StepPhoto() {
  const { cardData, updateCardData, nextStep } = useWizard()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(
    cardData.profile_image_url || null
  )
  const supabase = createClient()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase Storage
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      updateCardData({ profile_image_url: publicUrl })
    } catch (error: any) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = () => {
    setPreview(null)
    updateCardData({ profile_image_url: undefined })
  }

  const handleNext = () => {
    nextStep()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Add your photo
        </h2>
        <p className="text-gray-600">
          Upload a professional photo or skip this step
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Preview or Upload Area */}
            {preview ? (
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={removePhoto}
                  className="absolute top-0 right-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <div className="w-40 h-40 rounded-full border-4 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                  <Camera className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Tap to upload</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {uploading && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 text-primary-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                Tips for best results:
              </p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Use a clear, professional headshot</li>
                <li>Ensure good lighting and sharp focus</li>
                <li>Square format works best (1:1 ratio)</li>
                <li>Maximum file size: 5MB</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleNext}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Skip for now
          </button>
          <button
            onClick={handleNext}
            disabled={uploading}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
