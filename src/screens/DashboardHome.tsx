// src/screens/DashboardHome.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Share,
  ActivityIndicator,
  Image,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { supabase } from "../config/supabase";

// TODO: Set your web domain after you deploy loopcard-web
const WEB_BASE = "http://localhost:3000"; // e.g. "https://loopcard.app"

type CardRow = {
  id: string;
  full_name: string | null;
  business_name?: string | null;
  role?: string | null;
  slug: string | null;
  avatar_url?: string | null; // if you store a profile pic
  is_published: boolean;
};

export default function DashboardHome({ navigation }: any) {
  const [cards, setCards] = useState<CardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id ?? null;
      if (!uid) {
        setCards([]);
        setLoading(false);
        return;
      }

      // Pull all cards owned by this user (published or not—so user can preview/share)
      const { data, error } = await supabase
        .from("cards")
        .select("id, full_name, business_name, role, slug, is_published, avatar_url")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Load cards error:", error.message);
        setCards([]);
      } else {
        setCards(data || []);
      }
      setLoading(false);
    })();
  }, []);

  const openPreview = (slug?: string | null) => {
    if (!slug) return Alert.alert("No slug", "This card does not have a public slug yet.");
    const url = `${WEB_BASE}/c/${slug}`;
    Linking.openURL(url).catch(() => Alert.alert("Unable to open link", url));
  };

  const shareLink = async (slug?: string | null) => {
    if (!slug) return Alert.alert("No slug", "This card does not have a public slug yet.");
    const url = `${WEB_BASE}/c/${slug}`;
    try {
      await Share.share({ message: url, url });
    } catch (e) {
      Alert.alert("Share failed", String(e));
    }
  };

  /**
   * Download QR
   * We generate a QR PNG via a public QR service and save it to the Photos/Gallery.
   * You can switch this to your own loopcard-web QR endpoint later if you prefer.
   */
  const downloadQR = async (slug?: string | null) => {
  if (!slug) return Alert.alert("No slug", "This card does not have a public slug yet.");

  const targetUrl = `${WEB_BASE}/c/${slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${encodeURIComponent(targetUrl)}`;

  try {
    const fileUri = FileSystem.cacheDirectory + `loopcard-qr-${slug}.png`;
    const { uri } = await FileSystem.downloadAsync(qrUrl, fileUri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Share QR code" });
    } else {
      Alert.alert("Saved to cache", `QR downloaded to: ${uri}`);
    }
  } catch (e) {
    Alert.alert("Download failed", String(e));
  }
};

  const CardItem = ({ c }: { c: CardRow }) => {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 14,
          padding: 14,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#eee",
        }}
      >
        {/* Top row: avatar + identity */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              marginRight: 12,
            }}
          >
            {c.avatar_url ? (
              <Image
                source={{ uri: c.avatar_url }}
                style={{ width: 52, height: 52 }}
                resizeMode="cover"
              />
            ) : (
              <Text style={{ fontWeight: "700", color: "#111" }}>
                {(c.full_name || "U").slice(0, 1).toUpperCase()}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111" }}>
              {c.full_name || "Unnamed Card"}
            </Text>
            {!!c.business_name && (
              <Text style={{ color: "#555" }}>{c.business_name}</Text>
            )}
            {!!c.role && <Text style={{ color: "#777" }}>{c.role}</Text>}
            <Text style={{ color: c.is_published ? "#34C759" : "#FF3B30", marginTop: 2 }}>
              {c.is_published ? "Published" : "Unpublished"}
            </Text>
          </View>
        </View>

        {/* Slug row */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 12, color: "#666" }}>Public Link</Text>
          <Text style={{ fontSize: 14, color: "#0066FF" }}>
            {c.slug ? `${WEB_BASE}/c/${c.slug}` : "—"}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => openPreview(c.slug)}
            style={{
              flex: 1,
              backgroundColor: "#0066FF",
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Preview</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => shareLink(c.slug)}
            style={{
              flex: 1,
              backgroundColor: "#E5E7EB",
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ color: "#111", fontWeight: "600" }}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => downloadQR(c.slug)}
            style={{
              flex: 1,
              backgroundColor: "#E5E7EB",
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#111", fontWeight: "600" }}>Download QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F7F7F7" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 6 }}>Your Cards</Text>
      <Text style={{ color: "#666", marginBottom: 16 }}>
        Preview, share, or save the QR for any of your cards.
      </Text>

      {loading ? (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={{ marginTop: 8, color: "#666" }}>Loading cards…</Text>
        </View>
      ) : cards.length === 0 ? (
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
          <Text style={{ color: "#666" }}>
            No cards found. Create one from the Setup Wizard or Dashboard.
          </Text>
        </View>
      ) : (
        cards.map((c) => <CardItem key={c.id} c={c} />)
      )}
    </ScrollView>
  );
}
