// src/components/BasicInfoForm.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  fullName: string;
  businessName?: string;
  role?: string;
  tagline?: string;
  onChange: (fields: Partial<{
    fullName: string;
    businessName: string;
    role: string;
    tagline: string;
  }>) => void;
  showNameError?: boolean;
};

export default function BasicInfoForm({
  fullName,
  businessName,
  role,
  tagline,
  onChange,
  showNameError,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>Basic Information</Text>

      <Field
        label="Full Name *"
        icon="person-circle-outline"
        value={fullName}
        onChangeText={(t: string) => onChange({ fullName: t })}
        placeholder="e.g., Vishnu Vardhan"
        autoCapitalize="words"
        returnKeyType="next"
        error={showNameError ? 'Full name is required' : undefined}
      />

      <Field
        label="Business Name"
        icon="briefcase-outline"
        value={businessName ?? ''}
        onChangeText={(t: string) => onChange({ businessName: t })}
        placeholder="e.g., MVR Farms"
        autoCapitalize="words"
        returnKeyType="next"
      />

      <Field
        label="Role / Title"
        icon="id-card-outline"
        value={role ?? ''}
        onChangeText={(t: string) => onChange({ role: t })}
        placeholder="e.g., Founder"
        autoCapitalize="words"
        returnKeyType="next"
      />

      <Field
        label="Tagline"
        icon="chatbubble-ellipses-outline"
        value={tagline ?? ''}
        onChangeText={(t: string) => {
          if (t.length <= 120) onChange({ tagline: t });
        }}
        placeholder="e.g., Natural Bio Enzymes for Every Home"
        multiline
        numberOfLines={3}
        helper={`${(tagline ?? '').length}/120`}
      />
      <Text style={styles.note}>Only “Full Name” is required. Others are optional.</Text>
    </View>
  );
}

function Field(props: any) {
  const { label, icon, error, helper, style, ...rest } = props;
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={18} color="#93C5FD" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholderTextColor="#64748B"
          {...rest}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  heading: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 4 },
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
  error: { color: '#FCA5A5', fontSize: 12, marginTop: 4 },
  helper: { color: '#94A3B8', fontSize: 11, marginTop: 4, textAlign: 'right' },
  note: { color: '#94A3B8', fontSize: 12, marginTop: 8 },
});
