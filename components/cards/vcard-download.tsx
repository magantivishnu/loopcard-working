'use client'

import { Download } from 'lucide-react'

interface VCardDownloadProps {
  card: {
    full_name: string
    designation?: string | null
    business_name?: string | null
    phone?: string | null
    email?: string | null
    website?: string | null
    address?: string | null
  }
}

export function VCardDownload({ card }: VCardDownloadProps) {
  const generateVCard = () => {
    // Create vCard 3.0 format
    let vcard = 'BEGIN:VCARD\n'
    vcard += 'VERSION:3.0\n'
    vcard += `FN:${card.full_name}\n`
    
    // Name (formatted as: Last;First;Middle;Prefix;Suffix)
    const nameParts = card.full_name.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    vcard += `N:${lastName};${firstName};;;\n`
    
    if (card.designation) {
      vcard += `TITLE:${card.designation}\n`
    }
    
    if (card.business_name) {
      vcard += `ORG:${card.business_name}\n`
    }
    
    if (card.phone) {
      vcard += `TEL;TYPE=WORK,VOICE:${card.phone}\n`
    }
    
    if (card.email) {
      vcard += `EMAIL;TYPE=WORK:${card.email}\n`
    }
    
    if (card.website) {
      vcard += `URL:${card.website}\n`
    }
    
    if (card.address) {
      // Address format: ;;street;city;state;zip;country
      vcard += `ADR;TYPE=WORK:;;${card.address};;;;\n`
    }
    
    vcard += 'END:VCARD'
    
    return vcard
  }

  const handleDownload = () => {
    const vcard = generateVCard()
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

  return (
    <button
      onClick={handleDownload}
      className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-medium transition"
    >
      <Download className="w-4 h-4" />
      <span className="text-sm hidden sm:inline">Save Contact</span>
    </button>
  )
}
