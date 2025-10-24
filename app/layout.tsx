import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LoopCard - Your Digital Business Card',
  description: 'Create, share, and track your professional presence with a smart QR-powered business card',
  keywords: ['digital business card', 'QR code', 'networking', 'professional card'],
  authors: [{ name: 'LoopCard' }],
  openGraph: {
    title: 'LoopCard - Your Digital Business Card',
    description: 'Create, share, and track your professional presence with a smart QR-powered business card',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoopCard - Your Digital Business Card',
    description: 'Create, share, and track your professional presence with a smart QR-powered business card',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
