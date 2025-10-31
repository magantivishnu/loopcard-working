// src/components/PhotoUpload.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

type Props = {
  value?: string | null;
  onChange: (uri: string | null) => void;
};

export default function PhotoUpload({ value, onChange }: Props) {
  const [busy, setBusy] = useState(false);

  const ensurePermissions = useCallback(async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    return lib.status === 'granted' && cam.status === 'granted';
  }, []);

  const pickFromLibrary = useCallback(async () => {
    try {
      setBusy(true);
      const res = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1], // square crop UI
        quality: 0.9,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (res.canceled) return;
      const asset = res.assets[0];
      const out = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 512 } }], // keep square, downscale
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      onChange(out.uri);
    } catch (e) {
      Alert.alert('Error', 'Could not process the image.');
    } finally {
      setBusy(false);
    }
  }, [onChange]);

  const takePhoto = useCallback(async () => {
    try {
      setBusy(true);
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
      if (res.canceled) return;
      const asset = res.assets[0];
      const out = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 512 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      onChange(out.uri);
    } catch (e) {
      Alert.alert('Error', 'Could not capture the photo.');
    } finally {
      setBusy(false);
    }
  }, [onChange]);

  const onPressAdd = useCallback(async () => {
    const ok = await ensurePermissions();
    if (!ok) {
      Alert.alert('Permissions needed', 'Enable Camera and Photos permissions in Settings.');
      return;
    }
    Alert.alert('Add Photo', 'Choose image source', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickFromLibrary },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [ensurePermissions, pickFromLibrary, takePhoto]);

  const onRemove = useCallback(() => {
    Alert.alert('Remove Photo', 'Clear the current photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onChange(null) },
    ]);
  }, [onChange]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Profile Photo</Text>

      <View style={styles.row}>
        <View style={styles.avatarWrap}>
          {value ? (
            <Image source={{ uri: value }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>+</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.btn} onPress={onPressAdd} disabled={busy}>
            <Text style={styles.btnText}>{value ? 'Change Photo' : 'Add Photo'}</Text>
          </TouchableOpacity>

          {value ? (
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onRemove} disabled={busy}>
              <Text style={styles.btnSecondaryText}>Remove</Text>
            </TouchableOpacity>
          ) : null}

          {busy ? (
            <View style={styles.busyRow}>
              <ActivityIndicator />
              <Text style={styles.busyText}>Processing…</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Text style={styles.helper}>Square crop. Displayed as a circle on your card.</Text>
    </View>
  );
}

const AVATAR_SIZE = 112;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#0B1220',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  label: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '100%' },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#60A5FA', fontSize: 36, fontWeight: '900' },
  actions: { flex: 1 },
  btn: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  btnText: { color: '#00140A', fontSize: 14, fontWeight: '800' },
  btnSecondary: {
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: '#334155',
  },
  btnSecondaryText: { color: '#E2E8F0', fontSize: 14, fontWeight: '700' },
  helper: { color: '#94A3B8', fontSize: 12, marginTop: 8 },
  busyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4 },
  busyText: { color: '#94A3B8', fontSize: 12 },
});
