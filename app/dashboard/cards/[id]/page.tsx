import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, QrCode, Eye, Users, Edit2 } from 'lucide-react'
import { QRCodeDisplay } from '@/components/cards/qr-code-display'

interface PageProps {
  params: {
    id: string
  }
}

export default async function CardDetailPage({ params }: PageProps) {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Fetch card
  const { data: card, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !card) {
    notFound()
  }

  const cardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${card.slug}`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{card.full_name}</h1>
          <p className="text-gray-600 mt-1">{card.designation}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/${card.slug}`}
            target="_blank"
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Card</span>
          </Link>
          <button className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition">
            <Edit2 className="w-4 h-4" />
            <span>Edit Card</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {card.total_views || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {card.unique_views || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Status</p>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {card.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-gray-400">Inactive</span>
                )}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.is_active ? 'bg-green-100' : 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
              <div className={`w-3 h-3 rounded-full ${card.is_active ? 'bg-green-600' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code & Share */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6">
            <QrCode className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">QR Code</h2>
          </div>
          
          <QRCodeDisplay url={cardUrl} />

          <p className="text-sm text-gray-600 mt-4 text-center">
            Share this QR code for instant access to your digital card
          </p>
        </div>

        {/* Card Link */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Share Your Card</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Card URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={cardUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(cardUrl)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-lg transition"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={`loopcard.app/${card.slug}`}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 text-sm font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/?text=Check out my digital business card: ${cardUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition"
                >
                  <span>Share on WhatsApp</span>
                </a>
                <a
                  href={`mailto:?subject=My Digital Business Card&body=Check out my digital business card: ${cardUrl}`}
                  className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition"
                >
                  <span>Email Link</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Information */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Card Information</h2>
        
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-600">Full Name</dt>
            <dd className="text-base text-gray-900 mt-1">{card.full_name}</dd>
          </div>
          
          {card.business_name && (
            <div>
              <dt className="text-sm font-medium text-gray-600">Business Name</dt>
              <dd className="text-base text-gray-900 mt-1">{card.business_name}</dd>
            </div>
          )}
          
          <div>
            <dt className="text-sm font-medium text-gray-600">Designation</dt>
            <dd className="text-base text-gray-900 mt-1">{card.designation}</dd>
          </div>
          
          {card.email && (
            <div>
              <dt className="text-sm font-medium text-gray-600">Email</dt>
              <dd className="text-base text-gray-900 mt-1">{card.email}</dd>
            </div>
          )}
          
          {card.phone && (
            <div>
              <dt className="text-sm font-medium text-gray-600">Phone</dt>
              <dd className="text-base text-gray-900 mt-1">{card.phone}</dd>
            </div>
          )}
          
          {card.website && (
            <div>
              <dt className="text-sm font-medium text-gray-600">Website</dt>
              <dd className="text-base text-gray-900 mt-1">
                <a href={card.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                  {card.website}
                </a>
              </dd>
            </div>
          )}
          
          <div>
            <dt className="text-sm font-medium text-gray-600">Created</dt>
            <dd className="text-base text-gray-900 mt-1">
              {new Date(card.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-600">Template</dt>
            <dd className="text-base text-gray-900 mt-1 capitalize">{card.template_type}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
