import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system';
import { decode as base64ToArrayBuffer } from 'base64-arraybuffer';
import QRCode from 'qrcode';

export type CardInsert = {
  fullName: string;
  businessName: string;
  role: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  photoUri: string | null; // local file://
};

export type CardRecord = {
  id: string;
  user_id: string;
  slug: string;
  photo_path: string | null;
  qr_path: string | null;
  full_name: string;
  business_name: string | null;
  role: string | null;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  created_at: string;
  updated_at: string;
};

const AVATAR_BUCKET = 'avatars';
const QR_BUCKET = 'qrcodes';
const PUBLIC_BASE = 'https://example.com/cards/'; // TODO: replace with your real https URL

function toKebab(s: string) {
  const base = (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base.length ? base.slice(0, 48) : 'user';
}

/** Try base, then -2, -3, ... until free */
async function makeUniqueSlug(seed: string): Promise<string> {
  const kebab = toKebab(seed);
  for (let i = 0; i < 50; i++) {
    const slug = i === 0 ? kebab : `${kebab}-${i + 1}`;
    const { count, error } = await supabase
      .from('cards')
      .select('id', { head: true, count: 'exact' })
      .eq('slug', slug);
    if (error) throw error;
    if ((count ?? 0) === 0) return slug;
  }
  throw new Error('Could not allocate unique slug');
}

async function uploadBase64ToStorage(
  bucket: string,
  path: string,
  base64: string,
  contentType: string
): Promise<string> {
  const arrayBuffer = base64ToArrayBuffer(base64);
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType, upsert: true });
  if (error) throw error;
  return data.path;
}

async function uploadLocalImageToStorage(bucket: string, path: string, fileUri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
  return uploadBase64ToStorage(bucket, path, base64, 'image/jpeg');
}

async function generateAndUploadQR(bucket: string, path: string, url: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(url, { errorCorrectionLevel: 'M', margin: 2, width: 512 });
  const base64 = dataUrl.split(',')[1];
  return uploadBase64ToStorage(bucket, path, base64, 'image/png');
}

export async function saveWizardToSupabase(input: CardInsert): Promise<{ card: CardRecord; publicUrl: string }> {
  // Ensure session is present
  const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) throw sessErr;
  if (!sessionData.session) throw new Error('Not authenticated. Please sign in again.');

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!userData.user) throw new Error('Not authenticated. Please sign in again.');

  const user = userData.user;

  // Build preferred slug
  const seed = [input.fullName, input.businessName].filter(Boolean).join(' ');
  const slug = await makeUniqueSlug(seed);

  // Upload avatar if provided
  let photo_path: string | null = null;
  if (input.photoUri) {
    const avatarPath = `${user.id}/${slug}-avatar.jpg`;
    photo_path = await uploadLocalImageToStorage(AVATAR_BUCKET, avatarPath, input.photoUri);
  }

  // Public URL and QR
  const publicUrl = `${PUBLIC_BASE}${slug}`;
  const qrPath = `${user.id}/${slug}-qr.png`;
  const uploadedQrPath = await generateAndUploadQR(QR_BUCKET, qrPath, publicUrl);

  // Insert row
  const { data, error } = await supabase
    .from('cards')
    .insert({
      user_id: user.id,
      slug,
      photo_path,
      qr_path: uploadedQrPath,
      full_name: input.fullName,
      business_name: input.businessName || null,
      role: input.role || null,
      tagline: input.tagline || null,
      phone: input.phone || null,
      whatsapp: input.whatsapp || null,
      email: input.email || null,
      website: input.website || null,
      linkedin: input.linkedin || null,
      twitter: input.twitter || null,
      instagram: input.instagram || null,
      facebook: input.facebook || null,
    })
    .select('*')
    .single();

  if (error) throw error;

  return { card: data as CardRecord, publicUrl };
}
