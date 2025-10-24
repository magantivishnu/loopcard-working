'use client';

import { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { QrCode } from 'lucide-react';

interface Card {
  id: string;
  slug: string;
  full_name: string;
  profile_image_url: string | null;
}

interface QRCodeManagerProps {
  card: Card;
  baseUrl: string;
}

export default function QRCodeManager({ card, baseUrl }: QRCodeManagerProps) {
  const [showQR, setShowQR] = useState(false);
  const cardUrl = `${baseUrl}/${card.slug}`;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowQR(true)}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="View QR Code"
      >
        <QrCode className="w-5 h-5" />
      </button>

      {/* Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                {card.profile_image_url ? (
                  <img
                    src={card.profile_image_url}
                    alt={card.full_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                    {card.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {card.full_name}
              </h3>
              <p className="text-sm text-gray-600">QR Code</p>
            </div>

            <QRCodeDisplay
              value={cardUrl}
              size={240}
              downloadFileName={`${card.full_name.toLowerCase().replace(/\s+/g, '-')}-qr`}
            />

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-700 text-center">
                <strong>Share this QR code</strong> on business cards, flyers, or anywhere
                people can scan it!
              </p>
            </div>

            <button
              onClick={() => setShowQR(false)}
              className="mt-4 w-full py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
