import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type Params = { Success: { fullName: string; publicUrl: string; photoUrl?: string | null } };

export default function SuccessScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<RouteProp<Params, 'Success'>>();
  const { fullName, publicUrl, photoUrl } = route.params ?? { fullName: '', publicUrl: '', photoUrl: null };

  return (
    <View style={styles.safe}>
      <View style={styles.card}>
        <View style={styles.avatarWrap}>
          {photoUrl ? <Image source={{ uri: photoUrl }} style={styles.avatar} /> : <View style={[styles.avatar, styles.ph]} />}
        </View>
        <Text style={styles.title}>Card created</Text>
        <Text style={styles.name}>{fullName || 'Your card'}</Text>
        <Text style={styles.url}>{publicUrl}</Text>

        <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL(publicUrl)}>
          <Text style={styles.btnText}>Open public link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={() => nav.replace('Home' as never)}>
          <Text style={styles.btnText}>Go to dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B1830', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: '100%', backgroundColor: '#0F2344', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#16315A', alignItems: 'center' },
  avatarWrap: { width: 96, height: 96, marginBottom: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#0B1830' },
  ph: { borderWidth: 1, borderColor: '#2B3A59' },
  title: { color: '#AAB2C8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  name: { color: 'white', fontSize: 18, fontWeight: '700', marginTop: 6 },
  url: { color: '#7FB6FF', marginTop: 6, fontSize: 13 },
  btn: { marginTop: 14, backgroundColor: '#4F8EF7', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, width: '100%', alignItems: 'center' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2B3A59' },
  btnText: { color: 'white', fontWeight: '700' },
});
