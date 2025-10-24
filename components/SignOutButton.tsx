'use client'

import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      type="button"
      className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 py-2 transition"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-sm font-medium">Sign Out</span>
    </button>
  )
}