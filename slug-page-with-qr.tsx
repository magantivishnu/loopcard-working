import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Github,
  Download,
} from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import QRCodeSection from '@/components/QRCodeSection';

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
}

interface Card {
  id: string;
  slug: string;
  full_name: string;
  job_title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  bio: string | null;
  profile_image_url: string | null;
  social_links: SocialLinks | null;
  created_at: string;
}

async function getCard(slug: string): Promise<Card | null> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

async function trackView(cardId: string) {
  const supabase = createServerComponentClient({ cookies });

  await supabase.from('analytics_events').insert({
    card_id: cardId,
    event_type: 'view',
    device_type: 'unknown',
    browser: 'unknown',
  });
}

export default async function PublicCardPage({
  params,
}: {
  params: { slug: string };
}) {
  const card = await getCard(params.slug);

  if (!card) {
    notFound();
  }

  // Track the view
  await trackView(card.id);

  // Get the full URL for QR code
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const cardUrl = `${baseUrl}/${card.slug}`;

  // Generate vCard data
  const generateVCard = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.full_name}`,
      card.job_title ? `TITLE:${card.job_title}` : '',
      card.company ? `ORG:${card.company}` : '',
      card.email ? `EMAIL:${card.email}` : '',
      card.phone ? `TEL:${card.phone}` : '',
      card.website ? `URL:${card.website}` : '',
      card.location ? `ADR:;;${card.location};;;` : '',
      card.bio ? `NOTE:${card.bio}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');

    return vcard;
  };

  const socialIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    facebook: Facebook,
    github: Github,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32" />

          {/* Profile Section */}
          <div className="px-8 pb-8">
            {/* Profile Image */}
            <div className="flex justify-center -mt-16 mb-4">
              {card.profile_image_url ? (
                <Image
                  src={card.profile_image_url}
                  alt={card.full_name}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {card.full_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {card.full_name}
              </h1>
              {card.job_title && (
                <p className="text-lg text-gray-600">{card.job_title}</p>
              )}
              {card.company && (
                <p className="text-md text-gray-500">{card.company}</p>
              )}
            </div>

            {/* Bio */}
            {card.bio && (
              <div className="mb-6">
                <p className="text-gray-700 text-center leading-relaxed">
                  {card.bio}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              {card.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 group-hover:text-blue-600">
                    {card.email}
                  </span>
                </a>
              )}

              {card.phone && (
                <a
                  href={`tel:${card.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 group-hover:text-green-600">
                    {card.phone}
                  </span>
                </a>
              )}

              {card.location && (
                <div className="flex items-center gap-3 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">{card.location}</span>
                </div>
              )}

              {card.website && (
                <a
                  href={card.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 group-hover:text-purple-600">
                    {card.website}
                  </span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {card.social_links &&
              Object.keys(card.social_links).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Connect
                  </h3>
                  <div className="flex gap-3 justify-center">
                    {Object.entries(card.social_links).map(([platform, url]) => {
                      const Icon = socialIcons[platform as keyof typeof socialIcons];
                      if (!Icon || !url) return null;

                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Icon className="w-5 h-5 text-gray-700" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Download vCard */}
              <a
                href={`data:text/vcard;charset=utf-8,${encodeURIComponent(
                  generateVCard()
                )}`}
                download={`${card.full_name.replace(/\s+/g, '-')}.vcf`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                Save Contact
              </a>

              {/* Share Button */}
              <ShareButton url={cardUrl} name={card.full_name} />

              {/* QR Code Button */}
              <QRCodeSection url={cardUrl} cardName={card.full_name} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <a href="/" className="text-blue-600 hover:underline font-medium">
              LoopCard
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
