import { createServerClientStrict as createServer } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, CreditCard, Settings, Plus, BarChart3 } from 'lucide-react'
import { SignOutButton } from '@/components/SignOutButton'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createServer();


  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">LoopCard</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/cards/new"
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition"
              >
                <Plus className="w-4 h-4" />
                <span>New Card</span>
              </Link>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold text-sm">
                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
            <nav className="flex-1 px-4 py-6 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              <Link
                href="/dashboard/cards"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">My Cards</span>
              </Link>

              <Link
                href="/dashboard/analytics"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </nav>

            {/* Plan Info */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {profile?.plan_type === 'free' ? 'Free Plan' : 'Pro Plan'}
                  </span>
                  {profile?.plan_type === 'free' && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      Limited
                    </span>
                  )}
                </div>
                {profile?.plan_type === 'free' && (
                  <Link
                    href="/dashboard/upgrade"
                    className="block text-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm py-2 rounded-lg font-medium hover:shadow-lg transition mt-2"
                  >
                    Upgrade to Pro
                  </Link>
                )}
              </div>

              {/* Sign Out */}
              <div className="mt-4">
                <SignOutButton />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1">
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center py-3 text-gray-600 hover:text-primary-600 transition"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/dashboard/cards"
            className="flex flex-col items-center justify-center py-3 text-gray-600 hover:text-primary-600 transition"
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs mt-1">Cards</span>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="flex flex-col items-center justify-center py-3 text-gray-600 hover:text-primary-600 transition"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Stats</span>
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex flex-col items-center justify-center py-3 text-gray-600 hover:text-primary-600 transition"
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}