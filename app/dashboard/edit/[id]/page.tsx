// FIXED Edit Page - Server Component
// Save this as: app/dashboard/edit/[id]/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import EditCardForm from './EditCardForm';

async function getCard(id: string, userId: string) {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('cards')
    .select('*')  // ✅ Select ALL fields
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching card:', error);
    return null;
  }

  return data;
}

export default async function EditCardPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerComponentClient({ cookies });

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Get card - with ALL fields
  const card = await getCard(params.id, session.user.id);

  if (!card) {
    notFound();
  }

  console.log('Card data loaded:', {
    id: card.id,
    full_name: card.full_name,
    has_image: !!card.profile_image_url,
    image_url: card.profile_image_url
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Card
          </h1>

          <EditCardForm card={card} />
        </div>
      </div>
    </div>
  );
}