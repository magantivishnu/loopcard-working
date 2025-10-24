'use client';

import { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { QrCode, X } from 'lucide-react';

interface QRCodeSectionProps {
  url: string;
  cardName: string;
}

export default function QRCodeSection({ url, cardName }: QRCodeSectionProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      {/* QR Code Button */}
      <button
        onClick={() => setShowQR(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        <QrCode className="w-5 h-5" />
        Show QR Code
      </button>

      {/* QR Code Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                QR Code for {cardName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Scan this code to view the card instantly
              </p>
            </div>

            {/* QR Code */}
            <QRCodeDisplay
              value={url}
              size={240}
              downloadFileName={`${cardName.toLowerCase().replace(/\s+/g, '-')}-qr`}
            />

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-900">
                💡 <strong>Tip:</strong> Download this QR code and add it to business
                cards, flyers, or email signatures!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}