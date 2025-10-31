import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { WizardData } from '../screens/SetupWizard';

type Props = {
  data: WizardData;
};

export default function PreviewGenerate({ data }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Preview</Text>
      <Text style={styles.note}>Review your details. Tap “Generate Card” to continue.</Text>

      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          {data.photoUri ? (
            <Image source={{ uri: data.photoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{data.fullName || '—'}</Text>
          <Text style={styles.sub}>{data.businessName || '—'}</Text>
          <Text style={styles.sub}>{data.role || '—'}</Text>
          {data.tagline ? <Text style={styles.tagline}>"{data.tagline}"</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <KV k="Phone" v={data.phone} />
        <KV k="WhatsApp" v={data.whatsapp} />
        <KV k="Email" v={data.email} />
        <KV k="Website" v={data.website} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Socials</Text>
        <KV k="LinkedIn" v={data.linkedin} />
        <KV k="Twitter / X" v={data.twitter} />
        <KV k="Instagram" v={data.instagram} />
        <KV k="Facebook" v={data.facebook} />
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tip}>
          You can edit any step using Back. Data stays saved in this wizard.
        </Text>
      </View>
    </View>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.kv}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{v || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0F2344', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#16315A' },
  title: { color: 'white', fontSize: 16, fontWeight: '700' },
  note: { color: '#AAB2C8', fontSize: 12, marginTop: 6 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 16 },
  avatarWrap: { width: 72, height: 72 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#0B1830' },
  placeholder: { borderWidth: 1, borderColor: '#2B3A59' },
  name: { color: 'white', fontSize: 16, fontWeight: '700' },
  sub: { color: '#AAB2C8', marginTop: 2, fontSize: 12 },
  tagline: { color: '#7FB6FF', marginTop: 6, fontSize: 12, fontStyle: 'italic' },
  section: { marginTop: 16 },
  sectionTitle: { color: '#AAB2C8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  kv: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#14223F' },
  k: { color: '#AAB2C8', fontSize: 12 },
  v: { color: 'white', fontSize: 12, maxWidth: '65%' },
  tipBox: { backgroundColor: '#102646', borderRadius: 10, padding: 12, marginTop: 16, borderWidth: 1, borderColor: '#17365F' },
  tip: { color: '#AAB2C8', fontSize: 12 },
});
