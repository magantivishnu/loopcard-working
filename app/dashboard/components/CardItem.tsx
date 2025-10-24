// FIXED Dashboard Card Component
// Save this as: app/dashboard/components/CardItem.tsx
// (or wherever your dashboard card component is)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2, Eye, QrCode, MoreVertical } from 'lucide-react';

interface Card {
  id: string;
  slug: string;
  full_name: string;
  designation: string | null;
  email: string | null;
  phone: string | null;
  profile_image_url: string | null; // ✅ CORRECT field name
  total_views: number;
  created_at: string;
}

interface CardItemProps {
  card: Card;
  onDelete: (id: string) => void;
}

export default function CardItem({ card, onDelete }: CardItemProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/edit/${card.id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const supabase = createClientComponentClient();

      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', card.id);

      if (error) throw error;

      onDelete(card.id);
      setShowDeleteDialog(false);

      // Optional: Delete image from storage
      if (card.profile_image_url?.includes('supabase')) {
        const filePath = card.profile_image_url.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([filePath]);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Failed to delete card. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-20"></div>

        {/* Card Content */}
        <div className="p-6 -mt-10">
          {/* Profile Section */}
          <div className="flex items-start justify-between mb-4">
            {/* Profile Image - FIXED */}
            <div className="relative">
              {card.profile_image_url ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={card.profile_image_url}
                    alt={card.full_name || 'Profile'}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized={!card.profile_image_url.includes('supabase')}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                  {card.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Card</span>
                    </button>

                    <Link
                      href={`/${card.slug}`}
                      target="_blank"
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700 block"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Public Card</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteDialog(true);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Card</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card Info */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {card.full_name || 'Unnamed Card'}
            </h3>
            {card.designation && (
              <p className="text-blue-600 font-medium text-sm">
                {card.designation}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4 text-sm text-gray-600">
            {card.email && <p className="truncate">{card.email}</p>}
            {card.phone && <p>{card.phone}</p>}
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{card.total_views || 0} views</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>

              <Link
                href={`/${card.slug}`}
                target="_blank"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Card?
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <strong>{card.full_name}'s</strong> card? 
              This action cannot be undone.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}