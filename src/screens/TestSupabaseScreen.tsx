// File: src/screens/TestSupabaseScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../config/supabase';

export default function TestSupabaseScreen() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        if (error) throw error;
        setStatus('success');
        setMessage('✅ Supabase connection successful.');
      } catch (err: any) {
        setStatus('error');
        setMessage(`❌ Connection failed: ${err.message}`);
      }
    };
    testConnection();
  }, []);

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Testing Supabase connection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={{ color: status === 'success' ? 'green' : 'red', fontSize: 16 }}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
