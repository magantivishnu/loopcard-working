'use client'

import { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

interface ShareButtonProps {
  card: {
    slug: string
    full_name: string
    designation: string
  }
}

export function ShareButton({ card }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const cardUrl = `${window.location.origin}/${card.slug}`

  const handleShare = async () => {
    // Check if native share is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.full_name} - ${card.designation}`,
          text: `Check out ${card.full_name}'s digital business card`,
          url: cardUrl,
        })
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled')
      }
    } else {
      // Fallback to copy
      handleCopy()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Share</span>
        </>
      )}
    </button>
  )
}
