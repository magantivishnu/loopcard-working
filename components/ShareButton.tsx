'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  name: string;
}

export default function ShareButton({ url, name }: ShareButtonProps) {
  const handleShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Digital Card`,
          text: `Check out ${name}'s digital business card!`,
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          fallbackShare();
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    // Copy to clipboard as fallback
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Unable to share. Please copy this link: ' + url);
    });
  };

  return (
    <button
      onClick={handleShare}
      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
    >
      <Share2 className="w-5 h-5" />
      Share Card
    </button>
  );
}