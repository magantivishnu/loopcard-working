// src/screens/WelcomeScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (sess.session?.user) {
        navigation.reset({ index: 0, routes: [{ name: 'SetupWizard' }] });
      }
    })();
  }, [navigation]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.logo}>LoopCard</Text>
      <Text style={styles.tag}>Your smart, shareable business card</Text>

      <View style={{ height: 24 }} />

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.primaryText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.ghostText}>I already have an account</Text>
      </TouchableOpacity>

      <Text style={styles.note}>You’ll sign in with Email OTP on the next screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: 0.5 },
  tag: { color: '#A3AED0', marginTop: 8, textAlign: 'center' },
  primaryBtn: {
    marginTop: 28,
    backgroundColor: '#22C55E',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryText: { color: '#00140A', fontSize: 16, fontWeight: '800' },
  ghostBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderColor: '#334155',
    borderWidth: 1,
    backgroundColor: '#0B1220',
  },
  ghostText: { color: '#E2E8F0', fontSize: 14, fontWeight: '700' },
  note: { color: '#94A3B8', fontSize: 12, marginTop: 16, textAlign: 'center' },
});
