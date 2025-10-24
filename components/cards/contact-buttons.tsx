'use client'

import { Phone, Mail, MessageCircle, Globe } from 'lucide-react'

interface ContactButtonsProps {
  card: {
    phone?: string | null
    whatsapp?: string | null
    email?: string | null
    website?: string | null
  }
}

export function ContactButtons({ card }: ContactButtonsProps) {
  const buttons = []

  // Phone button
  if (card.phone) {
    buttons.push({
      label: 'Call',
      icon: Phone,
      href: `tel:${card.phone}`,
      color: 'bg-green-500 hover:bg-green-600',
    })
  }

  // WhatsApp button
  const whatsappNumber = card.whatsapp || card.phone
  if (whatsappNumber) {
    buttons.push({
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`,
      color: 'bg-emerald-500 hover:bg-emerald-600',
    })
  }

  // Email button
  if (card.email) {
    buttons.push({
      label: 'Email',
      icon: Mail,
      href: `mailto:${card.email}`,
      color: 'bg-blue-500 hover:bg-blue-600',
    })
  }

  // Website button
  if (card.website) {
    buttons.push({
      label: 'Website',
      icon: Globe,
      href: card.website,
      color: 'bg-purple-500 hover:bg-purple-600',
    })
  }

  if (buttons.length === 0) return null

  return (
    <div className={`grid gap-3 ${buttons.length === 1 ? 'grid-cols-1' : buttons.length === 2 ? 'grid-cols-2' : buttons.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
      {buttons.map((button) => {
        const Icon = button.icon
        return (
          <a
            key={button.label}
            href={button.href}
            target={button.label === 'Website' ? '_blank' : undefined}
            rel={button.label === 'Website' ? 'noopener noreferrer' : undefined}
            className={`${button.color} text-white px-4 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2`}
          >
            <Icon className="w-5 h-5" />
            <span>{button.label}</span>
          </a>
        )
      })}
    </div>
  )
}
