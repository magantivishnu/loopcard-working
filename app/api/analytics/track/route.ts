import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { card_id, event_type, userAgent, referrer } = body

    const supabase = createClient()

    // Get device type from user agent
    const getDeviceType = (ua: string) => {
      if (/mobile/i.test(ua)) return 'mobile'
      if (/tablet/i.test(ua)) return 'tablet'
      return 'desktop'
    }

    // Get browser from user agent
    const getBrowser = (ua: string) => {
      if (/chrome/i.test(ua)) return 'Chrome'
      if (/firefox/i.test(ua)) return 'Firefox'
      if (/safari/i.test(ua)) return 'Safari'
      if (/edge/i.test(ua)) return 'Edge'
      return 'Other'
    }

    // Get OS from user agent
    const getOS = (ua: string) => {
      if (/windows/i.test(ua)) return 'Windows'
      if (/mac/i.test(ua)) return 'MacOS'
      if (/linux/i.test(ua)) return 'Linux'
      if (/android/i.test(ua)) return 'Android'
      if (/ios/i.test(ua)) return 'iOS'
      return 'Other'
    }

    // Check if unique visitor (simple session-based)
    const sessionKey = `session_${card_id}`
    const isUniqueVisitor = !request.headers.get('cookie')?.includes(sessionKey)

    // Insert analytics event
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        card_id,
        event_type,
        referrer,
        user_agent: userAgent,
        device_type: getDeviceType(userAgent || ''),
        browser: getBrowser(userAgent || ''),
        os: getOS(userAgent || ''),
        is_unique_visitor: isUniqueVisitor,
      })

    if (insertError) {
      console.error('Analytics insert error:', insertError)
      throw insertError
    }

    // Update card view counts
    if (event_type === 'view') {
      const { error: updateError } = await supabase.rpc('increment_card_views', {
        card_uuid: card_id,
      })

      if (updateError) {
        console.error('Card views update error:', updateError)
      }

      // Update unique views if unique visitor
      if (isUniqueVisitor) {
        const { data: card } = await supabase
          .from('cards')
          .select('unique_views')
          .eq('id', card_id)
          .single()

        if (card) {
          await supabase
            .from('cards')
            .update({ unique_views: (card.unique_views || 0) + 1 })
            .eq('id', card_id)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}
