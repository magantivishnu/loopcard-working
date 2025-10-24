import Link from 'next/link'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Card Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          This digital business card doesn't exist or has been deactivated by the owner.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href="/"
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Go to Homepage
          </Link>
          
          <Link
            href="/auth/signup"
            className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-primary-500 hover:text-primary-600 transition"
          >
            Create Your Card
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Looking for someone's card? Make sure you have the correct link.
        </p>
      </div>
    </div>
  )
}
