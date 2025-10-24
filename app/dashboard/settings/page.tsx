import { createServerClientStrict as createServer } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'
import { User, Bell, Shield, CreditCard, LogOut } from 'lucide-react'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { AccountSettings } from '@/components/settings/account-settings'

export default async function SettingsPage() {
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
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Profile Information</h2>
                <p className="text-sm text-white/80">Update your personal details</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ProfileSettings user={user} profile={profile} />
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Account Settings</h2>
                <p className="text-sm text-white/80">Manage your account and security</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <AccountSettings user={user} profile={profile} />
          </div>
        </div>

        {/* Plan Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Subscription Plan</h2>
                <p className="text-sm text-white/80">Manage your subscription</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl font-bold text-gray-900 capitalize">
                    {profile?.plan_type || 'Free'} Plan
                  </span>
                  {profile?.plan_type === 'free' && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      Limited
                    </span>
                  )}
                  {profile?.plan_type === 'pro' && (
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-gray-600">
                  {profile?.plan_type === 'free' 
                    ? 'Create up to 2 cards with basic features'
                    : 'Unlimited cards with premium features'}
                </p>
              </div>
              {profile?.plan_type === 'free' && (
                <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                  Upgrade to Pro
                </button>
              )}
            </div>

            {/* Plan Features */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Current Plan Includes</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{profile?.plan_type === 'free' ? '2 Digital Cards' : 'Unlimited Digital Cards'}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic Analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>QR Code Generation</span>
                  </li>
                  {profile?.plan_type === 'pro' && (
                    <>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Custom Branding</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Advanced Analytics</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {profile?.plan_type === 'free' && (
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200">
                  <h4 className="font-semibold text-primary-900 mb-2">Upgrade to Pro</h4>
                  <ul className="space-y-2 text-sm text-primary-800">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited Cards</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Custom Branding</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Priority Support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Advanced Analytics</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100">
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-700">Irreversible actions for your account</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
              </div>
              <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
