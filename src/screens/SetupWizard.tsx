// src/screens/SetupWizard.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PhotoUpload from '../components/PhotoUpload';
import BasicInfoForm from '../components/BasicInfoForm';
import ContactLinksForm from '../components/ContactLinksForm';
import QRCode from 'react-native-qrcode-svg';
import { supabase } from '../config/supabase';

type WizardData = {
  photoUri?: string | null;
  fullName: string;
  businessName?: string;
  role?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
};

const TOTAL_STEPS = 4;
const PUBLIC_BASE = 'https://loopcard.app/u';

export default function SetupWizard() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [data, setData] = useState<WizardData>({
    photoUri: null, fullName: '', businessName: '', role: '', tagline: '',
    phone: '', whatsapp: '', email: '', website: '',
    linkedin: '', twitter: '', instagram: '', facebook: '',
  });
  const [saving, setSaving] = useState(false);
  const [doneUrl, setDoneUrl] = useState<string | null>(null);

  const progress = useMemo(() => step / TOTAL_STEPS, [step]);
  const canGoNext = () => (step === 2 ? data.fullName.trim().length > 0 : true);
  const onBack = () => { if (!saving && step > 1) setStep((s) => (s - 1) as any); };
  const onNext = () => { if (!saving && canGoNext()) step < 4 ? setStep((s) => (s + 1) as any) : finalize(); };

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const shortId = () => Math.random().toString(36).slice(2, 6);
  const previewSlug = (slugify(data.businessName || data.fullName || 'user') || `user-${shortId()}`);
  const previewUrl = `${PUBLIC_BASE}/${previewSlug}`;

  const uploadAvatarIfNeeded = async (userId: string): Promise<string | null> => {
    try {
      if (!data.photoUri) return null;
      if (/^https?:\/\//i.test(data.photoUri)) return data.photoUri;
      const res = await fetch(data.photoUri);
      const blob = await res.blob();
      const path = `${userId}/avatar-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, blob, {
        contentType: 'image/jpeg', upsert: false,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      return pub.publicUrl ?? null;
    } catch {
      return null;
    }
  };

  const ensureUniqueSlug = async (base: string) => {
    let candidate = base || `user-${shortId()}`;
    for (let i = 0; i < 3; i++) {
      const { data: rows, error } = await supabase.from('cards').select('slug').eq('slug', candidate).limit(1);
      if (error) throw error;
      if (!rows || rows.length === 0) return candidate;
      candidate = `${base}-${shortId()}`;
    }
    return `${base}-${Date.now().toString(36)}`;
  };

  const finalize = async () => {
    try {
      setSaving(true);

      // Use getSession() in React Native
      const { data: sess, error: sessErr } = await supabase.auth.getSession();
      if (sessErr || !sess?.session?.user) throw new Error('Not authenticated');
      const userId = sess.session.user.id;

      const avatarUrl = await uploadAvatarIfNeeded(userId);
      const baseSlug = slugify(data.businessName || data.fullName || 'user');
      const slug = await ensureUniqueSlug(baseSlug);

      const payload = {
        user_id: userId,
        slug,
        full_name: data.fullName,
        business_name: data.businessName || null,
        role: data.role || null,
        tagline: data.tagline || null,
        avatar_url: avatarUrl,
        phone: data.phone || null,
        whatsapp: data.whatsapp || null,
        email: data.email || null,
        website: data.website || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
      };

      const { error: upsertErr } = await supabase.from('cards').upsert(payload, { onConflict: 'user_id' }).select('slug').single();
      if (upsertErr) throw upsertErr;

      const url = `${PUBLIC_BASE}/${slug}`;
      setDoneUrl(url);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to create card.');
    } finally {
      setSaving(false);
    }
  };

  const showSuccess = !!doneUrl;
  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.flex} keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Setup Wizard</Text>
            <Text style={styles.subtitle}>Step {step} of {TOTAL_STEPS}</Text>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} /></View>
            <View style={styles.dotsRow}>
              {[1,2,3,4].map((idx) => <View key={idx} style={[styles.dot, idx <= step && styles.dotActive]} />)}
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {step === 1 && (
              <View style={styles.section}>
                <PhotoUpload value={data.photoUri || null} onChange={(uri) => setData((d) => ({ ...d, photoUri: uri }))} />
                <View style={styles.tipBox}><Text style={styles.tipTitle}>Tip</Text><Text style={styles.tipText}>Use a clear headshot. Good lighting helps.</Text></View>
              </View>
            )}
            {step === 2 && (
              <BasicInfoForm
                fullName={data.fullName}
                businessName={data.businessName}
                role={data.role}
                tagline={data.tagline}
                onChange={(fields) => setData((d) => ({ ...d, ...fields }))}
                showNameError={data.fullName.trim().length === 0}
              />
            )}
            {step === 3 && (
              <ContactLinksForm
                phone={data.phone} whatsapp={data.whatsapp} email={data.email} website={data.website}
                linkedin={data.linkedin} twitter={data.twitter} instagram={data.instagram} facebook={data.facebook}
                onChange={(fields) => setData((d) => ({ ...d, ...fields }))}
              />
            )}
            {step === 4 && (showSuccess ? <SuccessPanel url={doneUrl!} onHome={goHome} /> : <PreviewPanel data={data} url={previewUrl} />)}
          </ScrollView>

          <View style={styles.navRow}>
            <TouchableOpacity style={[styles.button, (step === 1 || saving || showSuccess) && styles.buttonDisabled]} onPress={onBack} disabled={step === 1 || saving || showSuccess}>
              <Text style={[styles.buttonText, (step === 1 || saving || showSuccess) && styles.buttonTextDisabled]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonPrimary, (!canGoNext() || saving || showSuccess) && styles.buttonPrimaryDisabled]} onPress={onNext} disabled={!canGoNext() || saving || showSuccess}>
              {saving ? <ActivityIndicator color="#00140A" /> : <Text style={styles.buttonPrimaryText}>{step < 4 ? 'Next' : 'Generate Card'}</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.helper}><Text style={styles.helperText} numberOfLines={1}>step: {step} | name: {data.fullName || '<empty>'} | saved: {showSuccess ? 'yes' : 'no'}</Text></View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PreviewPanel({ data, url }: { data: WizardData; url: string }) {
  return (
    <View style={styles.previewCard}>
      <View style={styles.previewHeader}>
        {data.photoUri ? <Image source={{ uri: data.photoUri }} style={styles.previewAvatar} /> : <View style={[styles.previewAvatar, styles.previewAvatarPh]}><Text style={{ color: '#60A5FA', fontWeight: '800' }}>+</Text></View>}
        <View style={{ flex: 1 }}>
          <Text style={styles.previewName}>{data.fullName || 'Your Name'}</Text>
          <Text style={styles.previewSub}>{(data.businessName || '').toString()}{data.role ? ` • ${data.role}` : ''}</Text>
          {data.tagline ? <Text style={styles.previewTag}>{data.tagline}</Text> : null}
        </View>
      </View>
      <View style={styles.previewBody}>
        <Text style={styles.previewLabel}>Your public link (preview)</Text>
        <Text style={styles.previewUrl}>{url}</Text>
        <View style={styles.qrWrap}><QRCode value={url} size={160} /></View>
        <Text style={styles.previewHint}>This QR is for preview. Final link may change after saving.</Text>
      </View>
    </View>
  );
}

function SuccessPanel({ url, onHome }: { url: string; onHome: () => void }) {
  return (
    <View style={styles.successCard}>
      <Text style={styles.successTitle}>Card Created</Text>
      <Text style={styles.successUrl}>{url}</Text>
      <View style={styles.qrWrap}><QRCode value={url} size={180} /></View>
      <Text style={styles.successNote}>Scan or share this link. You can edit details later.</Text>
      <TouchableOpacity style={[styles.buttonPrimary, { marginTop: 16, width: '100%' }]} onPress={onHome}>
        <Text style={styles.buttonPrimaryText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const AVATAR = 72;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F172A' },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 12 },
  header: { paddingTop: 8, paddingBottom: 4 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#A3AED0', fontSize: 13, marginTop: 2 },
  progressWrap: { marginTop: 12, marginBottom: 8 },
  progressTrack: { height: 8, backgroundColor: '#1F2A44', borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#38BDF8' },
  dotsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#334155' },
  dotActive: { backgroundColor: '#60A5FA' },
  content: { paddingVertical: 16 },
  section: { gap: 12 },

  previewCard: { backgroundColor: '#0B1220', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1E293B', gap: 12 },
  previewHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  previewAvatar: { width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2, borderWidth: 1, borderColor: '#334155' },
  previewAvatarPh: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A' },
  previewName: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  previewSub: { color: '#C7D2FE', fontSize: 13, marginTop: 2 },
  previewTag: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  previewBody: { marginTop: 6, alignItems: 'center' },
  previewLabel: { color: '#A3AED0', fontSize: 12 },
  previewUrl: { color: '#7DD3FC', fontSize: 13, marginTop: 4 },
  qrWrap: { marginTop: 12, padding: 12, backgroundColor: '#0F172A', borderRadius: 12, borderWidth: 1, borderColor: '#1E293B' },
  previewHint: { color: '#94A3B8', fontSize: 11, marginTop: 8, textAlign: 'center' },

  successCard: { backgroundColor: '#062014', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#14532D', alignItems: 'center' },
  successTitle: { color: '#86EFAC', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  successUrl: { color: '#A7F3D0', fontSize: 13 },
  successNote: { color: '#A7F3D0', fontSize: 12, marginTop: 10, textAlign: 'center' },

  card: { backgroundColor: '#0B1220', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1E293B' },
  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardDesc: { color: '#C7D2FE', fontSize: 14, marginBottom: 8 },
  muted: { color: '#94A3B8', fontSize: 12 },
  warn: { color: '#FCA5A5', fontSize: 13, marginBottom: 6 },

  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  button: { flex: 1, height: 48, borderRadius: 10, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1220' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#E2E8F0', fontSize: 15, fontWeight: '600' },
  buttonTextDisabled: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
  buttonPrimary: { flex: 1, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#22C55E' },
  buttonPrimaryDisabled: { backgroundColor: '#14532D' },
  buttonPrimaryText: { color: '#00140A', fontSize: 15, fontWeight: '800' },

  helper: { marginTop: 8, alignItems: 'center' },
  helperText: { color: '#7DD3FC', fontSize: 12 },

  tipBox: { backgroundColor: '#0B3B2A', borderColor: '#14532D', borderWidth: 1, borderRadius: 10, padding: 12 },
  tipTitle: { color: '#86EFAC', fontSize: 13, fontWeight: '800', marginBottom: 4 },
  tipText: { color: '#D1FAE5', fontSize: 12 },
});
