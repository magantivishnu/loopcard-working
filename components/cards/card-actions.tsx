'use client'

import { Phone, Mail, MessageCircle, Download, Share2 } from 'lucide-react'
import { useState } from 'react'

interface CardActionsProps {
  card: any
}

export function CardActions({ card }: CardActionsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleCall = () => {
    if (card.phone) {
      window.location.href = `tel:${card.phone}`
    }
  }

  const handleEmail = () => {
    if (card.email) {
      window.location.href = `mailto:${card.email}`
    }
  }

  const handleWhatsApp = () => {
    const number = (card.whatsapp || card.phone)?.replace(/[^0-9]/g, '')
    if (number) {
      window.open(`https://wa.me/${number}`, '_blank')
    }
  }

  const handleDownloadVCard = () => {
    // Generate vCard
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.full_name}
N:${card.full_name};;;
${card.designation ? `TITLE:${card.designation}\n` : ''}${card.business_name ? `ORG:${card.business_name}\n` : ''}${card.phone ? `TEL;TYPE=WORK,VOICE:${card.phone}\n` : ''}${card.email ? `EMAIL;TYPE=INTERNET:${card.email}\n` : ''}${card.website ? `URL:${card.website}\n` : ''}${card.address ? `ADR;TYPE=WORK:;;${card.address};;;;\n` : ''}${card.profile_image_url ? `PHOTO;VALUE=URL:${card.profile_image_url}\n` : ''}END:VCARD`

    // Create blob and download
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${card.full_name.replace(/\s+/g, '_')}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const shareData = {
      title: `${card.full_name} - ${card.designation}`,
      text: `Check out ${card.full_name}'s digital business card`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        {card.phone && (
          <button
            onClick={handleCall}
            className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-green-600 transition shadow-lg hover:shadow-xl"
          >
            <Phone className="w-5 h-5" />
            <span>Call</span>
          </button>
        )}

        {card.email && (
          <button
            onClick={handleEmail}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-blue-600 transition shadow-lg hover:shadow-xl"
          >
            <Mail className="w-5 h-5" />
            <span>Email</span>
          </button>
        )}

        {(card.whatsapp || card.phone) && (
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center space-x-2 bg-emerald-500 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-emerald-600 transition shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>
        )}

        <button
          onClick={handleDownloadVCard}
          className="flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-4 rounded-2xl font-semibold hover:bg-gray-900 transition shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5" />
          <span>Save</span>
        </button>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-xl transition"
      >
        <Share2 className="w-5 h-5" />
        <span>Share This Card</span>
      </button>
    </div>
  )
}
