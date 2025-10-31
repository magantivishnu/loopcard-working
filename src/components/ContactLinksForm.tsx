// src/components/ContactLinksForm.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ContactState = {
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
};

type Props = ContactState & {
  onChange: (fields: Partial<ContactState>) => void;
};

export default function ContactLinksForm({
  phone,
  whatsapp,
  email,
  website,
  linkedin,
  twitter,
  instagram,
  facebook,
  onChange,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Contact</Text>

      <Field
        label="Phone"
        icon="call-outline"
        value={phone ?? ''}
        onChangeText={(t: string) => onChange({ phone: t })}
        placeholder="e.g., 9876543210"
        keyboardType="phone-pad"
      />

      <Field
        label="WhatsApp"
        icon="logo-whatsapp"
        value={whatsapp ?? ''}
        onChangeText={(t: string) => onChange({ whatsapp: t })}
        placeholder="e.g., 9876543210"
        keyboardType="phone-pad"
      />

      <Field
        label="Email"
        icon="mail-outline"
        value={email ?? ''}
        onChangeText={(t: string) => onChange({ email: t.toLowerCase() })}
        placeholder="e.g., name@domain.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Field
        label="Website"
        icon="globe-outline"
        value={website ?? ''}
        onChangeText={(t: string) => onChange({ website: t.toLowerCase() })}
        placeholder="e.g., https://mvrfarms.in"
        autoCapitalize="none"
        keyboardType="url"
      />

      <Text style={styles.heading}>Social</Text>

      <Field
        label="LinkedIn"
        icon="logo-linkedin"
        value={linkedin ?? ''}
        onChangeText={(t: string) => onChange({ linkedin: t.toLowerCase() })}
        placeholder="e.g., linkedin.com/in/username"
        autoCapitalize="none"
        keyboardType="url"
      />

      <Field
        label="Twitter / X"
        icon="logo-twitter"
        value={twitter ?? ''}
        onChangeText={(t: string) => onChange({ twitter: t.toLowerCase() })}
        placeholder="e.g., x.com/handle"
        autoCapitalize="none"
        keyboardType="url"
      />

      <Field
        label="Instagram"
        icon="logo-instagram"
        value={instagram ?? ''}
        onChangeText={(t: string) => onChange({ instagram: t.toLowerCase() })}
        placeholder="e.g., instagram.com/handle"
        autoCapitalize="none"
        keyboardType="url"
      />

      <Field
        label="Facebook"
        icon="logo-facebook"
        value={facebook ?? ''}
        onChangeText={(t: string) => onChange({ facebook: t.toLowerCase() })}
        placeholder="e.g., facebook.com/username"
        autoCapitalize="none"
        keyboardType="url"
      />

      <Text style={styles.note}>All fields optional. You can add or edit later.</Text>
    </View>
  );
}

function Field(props: any) {
  const { label, icon, helper, style, ...rest } = props;
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={18} color="#93C5FD" style={{ marginRight: 8 }} />
        <TextInput style={styles.input} placeholderTextColor="#64748B" {...rest} />
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#0B1220',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 8,
  },
  heading: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 2, marginBottom: 6 },
  field: { marginTop: 6 },
  label: { color: '#E2E8F0', fontSize: 13, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  input: { flex: 1, color: '#F8FAFC', fontSize: 14, paddingVertical: 10 },
  helper: { color: '#94A3B8', fontSize: 11, marginTop: 4, textAlign: 'right' },
  note: { color: '#94A3B8', fontSize: 12, marginTop: 10 },
});
