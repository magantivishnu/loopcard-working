import { type ClassValue, clsx } from 'clsx'

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Generate unique slug
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substr(2, 6)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/
  return phoneRegex.test(phone)
}

// Format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format relative time
export function formatRelativeTime(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// Download file
export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Get device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Get browser info
export function getBrowserInfo(): { name: string; version: string } {
  const ua = navigator.userAgent
  let browserName = 'Unknown'
  let browserVersion = ''

  if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox'
    browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || ''
  } else if (ua.indexOf('Chrome') > -1) {
    browserName = 'Chrome'
    browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || ''
  } else if (ua.indexOf('Safari') > -1) {
    browserName = 'Safari'
    browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || ''
  } else if (ua.indexOf('Edge') > -1) {
    browserName = 'Edge'
    browserVersion = ua.match(/Edge\/(\d+\.\d+)/)?.[1] || ''
  }

  return { name: browserName, version: browserVersion }
}

// Get OS info
export function getOSInfo(): string {
  const ua = navigator.userAgent
  if (ua.indexOf('Win') > -1) return 'Windows'
  if (ua.indexOf('Mac') > -1) return 'MacOS'
  if (ua.indexOf('Linux') > -1) return 'Linux'
  if (ua.indexOf('Android') > -1) return 'Android'
  if (ua.indexOf('iOS') > -1) return 'iOS'
  return 'Unknown'
}

// Generate vCard
export function generateVCard(data: {
  fullName: string
  phone?: string
  email?: string
  website?: string
  company?: string
  title?: string
  address?: string
}): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.fullName}`,
  ]

  if (data.company) lines.push(`ORG:${data.company}`)
  if (data.title) lines.push(`TITLE:${data.title}`)
  if (data.phone) lines.push(`TEL:${data.phone}`)
  if (data.email) lines.push(`EMAIL:${data.email}`)
  if (data.website) lines.push(`URL:${data.website}`)
  if (data.address) lines.push(`ADR:;;${data.address};;;;`)

  lines.push('END:VCARD')

  return lines.join('\r\n')
}

// Download vCard
export function downloadVCard(data: {
  fullName: string
  phone?: string
  email?: string
  website?: string
  company?: string
  title?: string
  address?: string
}) {
  const vcard = generateVCard(data)
  const blob = new Blob([vcard], { type: 'text/vcard' })
  const url = URL.createObjectURL(blob)
  const fileName = `${data.fullName.replace(/\s+/g, '_')}.vcf`
  downloadFile(url, fileName)
  URL.revokeObjectURL(url)
}

// Share API helper
export async function shareCard(data: {
  title: string
  text: string
  url: string
}): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch {
      return false
    }
  }
  return false
}

// Calculate engagement score
export function calculateEngagementScore(
  views: number,
  clicks: number,
  timeSpent: number
): number {
  // Simple engagement score algorithm
  const clickRate = views > 0 ? clicks / views : 0
  const avgTimeSpent = timeSpent / Math.max(views, 1)
  
  let score = 0
  score += clickRate * 40 // 40% weight on click-through rate
  score += Math.min(avgTimeSpent / 30, 1) * 40 // 40% weight on time spent (max 30s)
  score += Math.min(views / 100, 1) * 20 // 20% weight on view count

  return Math.round(score * 100)
}

// Format number with abbreviation
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

// Generate random avatar color
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ]
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}

// Get initials from name
export function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
