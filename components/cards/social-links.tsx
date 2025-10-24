'use client'

import { Linkedin, Instagram, Twitter, Facebook, Github, Youtube } from 'lucide-react'

interface SocialLinksProps {
  socialLinks: any
}

export function SocialLinks({ socialLinks }: SocialLinksProps) {
  const getSocialIcon = (platform: string) => {
    const icons: Record<string, any> = {
      linkedin: Linkedin,
      instagram: Instagram,
      twitter: Twitter,
      facebook: Facebook,
      github: Github,
      youtube: Youtube,
    }
    return icons[platform.toLowerCase()] || null
  }

  const getSocialColor = (platform: string) => {
    const colors: Record<string, string> = {
      linkedin: 'bg-blue-600 hover:bg-blue-700',
      instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:opacity-90',
      twitter: 'bg-black hover:bg-gray-900',
      facebook: 'bg-blue-500 hover:bg-blue-600',
      github: 'bg-gray-800 hover:bg-gray-900',
      youtube: 'bg-red-600 hover:bg-red-700',
    }
    return colors[platform.toLowerCase()] || 'bg-gray-600 hover:bg-gray-700'
  }

  const getSocialUrl = (platform: string, value: string) => {
    // If already a full URL, return it
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }

    // Handle username formats
    const username = value.replace('@', '')

    const urls: Record<string, string> = {
      linkedin: `https://linkedin.com/in/${username}`,
      instagram: `https://instagram.com/${username}`,
      twitter: `https://twitter.com/${username}`,
      facebook: `https://facebook.com/${username}`,
      github: `https://github.com/${username}`,
      youtube: `https://youtube.com/@${username}`,
    }

    return urls[platform.toLowerCase()] || value
  }

  const socialEntries = Object.entries(socialLinks || {}).filter(([_, value]) => value)

  if (socialEntries.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="w-1.5 h-6 bg-primary-500 rounded-full mr-3"></span>
        Connect With Me
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {socialEntries.map(([platform, value]) => {
          const Icon = getSocialIcon(platform)
          if (!Icon) return null

          return (
            <a
              key={platform}
              href={getSocialUrl(platform, value as string)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center justify-center p-4 rounded-2xl text-white transition transform hover:scale-105 shadow-lg hover:shadow-xl ${getSocialColor(platform)}`}
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium capitalize">{platform}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
