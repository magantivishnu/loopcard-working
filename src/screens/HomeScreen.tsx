// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert, Linking, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';

const PUBLIC_BASE = 'https://loopcard.app/u';

type CardRow = {
  id: string;
  slug: string;
  full_name: string | null;
  business_name: string | null;
  role: string | null;
  avatar_url: string | null;
  updated_at: string;
};

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cards, setCards] = useState<CardRow[]>([]);

  const load = useCallback(async () => {
    try {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess?.session?.user?.id;
      if (!uid) {
        nav.reset({ index: 0, routes: [{ name: 'Welcome' }] });
        return;
      }

      const { data, error } = await supabase
        .from('cards')
        .select('id, slug, full_name, business_name, role, avatar_url, updated_at')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setCards(data ?? []);

      // Rule 1: no cards → redirect to SetupWizard
      if (!data || data.length === 0) {
        nav.reset({ index: 0, routes: [{ name: 'SetupWizard' }] });
        return;
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [nav]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CardRow }) => {
    const url = `${PUBLIC_BASE}/${item.slug}`;
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.full_name || 'Card'}</Text>
        {!!item.business_name && <Text style={styles.cardSub}>{item.business_name}{item.role ? ` • ${item.role}` : ''}</Text>}
        <Text style={styles.cardLink}>{url}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={() => Linking.openURL(url)}>
            <Text style={styles.btnText}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={() => nav.navigate('SetupWizard')}>
            <Text style={styles.ghostText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Rule 2: cards exist → show dashboard list
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Your Cards</Text>
      <FlatList
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingVertical: 12, gap: 12 }}
        data={cards}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListFooterComponent={
          <TouchableOpacity style={[styles.btn, styles.full]} onPress={() => nav.navigate('SetupWizard')}>
            <Text style={styles.btnText}>Create / Update Card</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  muted: { color: '#94A3B8', marginTop: 8 },
  wrap: { flex: 1, backgroundColor: '#0F172A', padding: 16, alignItems: 'center' },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', alignSelf: 'flex-start' },
  card: { width: '100%', backgroundColor: '#0B1220', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#1E293B' },
  cardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  cardSub: { color: '#A3AED0', fontSize: 12, marginTop: 2 },
  cardLink: { color: '#7DD3FC', fontSize: 12, marginTop: 8 },
  row: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, backgroundColor: '#22C55E', borderRadius: 10, height: 44, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#00140A', fontWeight: '800' },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#334155' },
  ghostText: { color: '#E2E8F0', fontWeight: '700' },
  full: { width: '100%', marginTop: 8 },
});
