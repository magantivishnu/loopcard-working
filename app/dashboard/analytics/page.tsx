import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Eye, Users, TrendingUp, Globe, Smartphone, Monitor, Tablet } from 'lucide-react'
import { BarChart3 } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Get all user's cards
  const { data: cards } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', user.id)

  // Get analytics events for all cards
  const cardIds = cards?.map(card => card.id) || []
  
  const { data: analytics } = await supabase
    .from('analytics_events')
    .select('*')
    .in('card_id', cardIds)
    .order('created_at', { ascending: false })
    .limit(100)

  // Calculate stats
  const totalViews = cards?.reduce((sum, card) => sum + (card.total_views || 0), 0) || 0
  const uniqueViews = cards?.reduce((sum, card) => sum + (card.unique_views || 0), 0) || 0

  // Device breakdown
  const deviceStats = analytics?.reduce((acc: any, event) => {
    acc[event.device_type] = (acc[event.device_type] || 0) + 1
    return acc
  }, {}) || {}

  // Browser breakdown
  const browserStats = analytics?.reduce((acc: any, event) => {
    acc[event.browser] = (acc[event.browser] || 0) + 1
    return acc
  }, {}) || {}

  // Recent views (last 7 days)
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  
  const recentViews = analytics?.filter(event => 
    new Date(event.created_at) >= last7Days
  ).length || 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track your card performance and visitor insights
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalViews}</p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{uniqueViews}</p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Last 7 Days</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{recentViews}</p>
              <p className="text-sm text-gray-500 mt-1">Recent views</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Active Cards</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {cards?.filter(c => c.is_active).length || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Out of {cards?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Device & Browser Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Desktop</span>
                </div>
                <span className="font-semibold text-gray-900">{deviceStats.desktop || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${totalViews ? ((deviceStats.desktop || 0) / totalViews) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Mobile</span>
                </div>
                <span className="font-semibold text-gray-900">{deviceStats.mobile || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${totalViews ? ((deviceStats.mobile || 0) / totalViews) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Tablet className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Tablet</span>
                </div>
                <span className="font-semibold text-gray-900">{deviceStats.tablet || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${totalViews ? ((deviceStats.tablet || 0) / totalViews) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h2>
          <div className="space-y-4">
            {Object.entries(browserStats).slice(0, 5).map(([browser, count]: [string, any]) => (
              <div key={browser}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{browser}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${totalViews ? (count / totalViews) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Performance */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Card Performance</h2>
        
        {!cards || cards.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No cards created yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <div key={card.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-200 to-secondary-200">
                    {card.profile_image_url ? (
                      <img src={card.profile_image_url} alt={card.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-700">
                          {card.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{card.full_name}</h3>
                    <p className="text-sm text-gray-500">{card.designation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{card.total_views || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Unique</p>
                    <p className="text-2xl font-bold text-gray-900">{card.unique_views || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        
        {!analytics || analytics.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.slice(0, 10).map((event) => {
              const card = cards?.find(c => c.id === event.card_id)
              return (
                <div key={event.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.device_type === 'mobile' ? 'bg-green-100' : 
                      event.device_type === 'tablet' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {event.device_type === 'mobile' ? (
                        <Smartphone className="w-5 h-5 text-green-600" />
                      ) : event.device_type === 'tablet' ? (
                        <Tablet className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Monitor className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        View on {card?.full_name}'s card
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.browser} • {event.os} • {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {event.is_unique_visitor && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      New
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
