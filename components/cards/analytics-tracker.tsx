'use client'

import { useEffect } from 'react'

interface AnalyticsTrackerProps {
  cardId: string
}

export function AnalyticsTracker({ cardId }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Track page view
    const trackView = async () => {
      try {
        // Get visitor info
        const visitorData = {
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
        }

        // Send to API
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            card_id: cardId,
            event_type: 'view',
            ...visitorData,
          }),
        })
      } catch (error) {
        console.error('Analytics tracking error:', error)
      }
    }

    // Track after a short delay to ensure it's a real visit
    const timer = setTimeout(trackView, 1000)

    return () => clearTimeout(timer)
  }, [cardId])

  return null // This component doesn't render anything
}
