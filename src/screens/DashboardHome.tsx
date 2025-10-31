// src/screens/DashboardHome.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
  Image,
  Switch,
} from "react-native";
import { supabase } from "../config/supabase";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import QRCode from "react-native-qrcode-svg";

// ⚠️ same IP you used in CardPreviewScreen (or your prod domain)
const WEB_BASE = "http://192.168.0.112:3000";

type CardRow = {
  id: string;
  full_name: string | null;
  business_name?: string | null;
  role?: string | null;
  slug: string | null;
  avatar_url?: string | null;
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
      const { data, error } = await supabase
        .from("cards")
        .select("id, full_name, business_name, role, slug, is_published, avatar_url")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) Alert.alert("Load error", error.message);
      setCards(data || []);
      setLoading(false);
    })();
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    const { error } = await supabase.from("cards").update({ is_published: !current }).eq("id", id);
    if (error) return Alert.alert("Update failed", error.message);
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, is_published: !current } : c)));
  };

  const openPreviewInApp = (slug?: string | null) => {
    if (!slug) return Alert.alert("No slug", "This card has no public link.");
    navigation.navigate("CardPreview", { slug });
  };

  const openEdit = (id: string) => navigation.navigate("EditCard", { id });

  const shareLink = async (slug?: string | null) => {
    if (!slug) return Alert.alert("No slug");
    const url = `${WEB_BASE}/c/${slug}`;
    try {
      await Share.share({ message: url, url });
    } catch (e) {
      Alert.alert("Share failed", String(e));
    }
  };

  // ---- QR capture via ViewShot + react-native-qrcode-svg (no file download) ----
  const qrRefs = useRef<Record<string, ViewShot | null>>({});

  const shareQR = async (c: CardRow) => {
    if (!c.slug) return Alert.alert("No slug", "This card has no public link.");
    const ref = qrRefs.current[c.id];
    if (!ref) return Alert.alert("QR not ready", "Please try again.");
    try {
      const uri = await ref.capture?.(); // returns a png file URI in cache
      if (!uri) throw new Error("Failed to capture QR");
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Share QR code" });
      } else {
        Alert.alert("QR ready", `PNG at: ${uri}`);
      }
    } catch (e: any) {
      Alert.alert("QR share failed", String(e?.message ?? e));
    }
  };

  const CardItem = ({ c }: { c: CardRow }) => {
    const url = c.slug ? `${WEB_BASE}/c/${c.slug}` : "";

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
        {/* avatar + name + publish */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
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
              <Image source={{ uri: c.avatar_url }} style={{ width: 52, height: 52 }} />
            ) : (
              <Text style={{ fontWeight: "700", color: "#111" }}>
                {(c.full_name || "U").slice(0, 1).toUpperCase()}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700" }}>{c.full_name || "Unnamed"}</Text>
            {!!c.business_name && <Text style={{ color: "#555" }}>{c.business_name}</Text>}
            {!!c.role && <Text style={{ color: "#777" }}>{c.role}</Text>}
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: "#666" }}>Published</Text>
            <Switch value={c.is_published} onValueChange={() => togglePublish(c.id, c.is_published)} />
          </View>
        </View>

        {/* public link */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 12, color: "#666" }}>Public Link</Text>
          <Text style={{ fontSize: 14, color: "#0066FF" }}>{c.slug ? url : "—"}</Text>
        </View>

        {/* actions */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => openPreviewInApp(c.slug)}
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
            onPress={() => openEdit(c.id)}
            style={{
              flex: 1,
              backgroundColor: "#E5E7EB",
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ color: "#111", fontWeight: "600" }}>Edit</Text>
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
            onPress={() => shareQR(c)}
            style={{
              flex: 1,
              backgroundColor: "#E5E7EB",
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#111", fontWeight: "600" }}>QR</Text>
          </TouchableOpacity>
        </View>

        {/* Hidden QR renderer just for capture (off-screen) */}
        <View style={{ position: "absolute", left: -9999, top: -9999 }}>
          <ViewShot
            ref={(r) => {
              qrRefs.current[c.id] = r;
            }}
            options={{ format: "png", quality: 1, result: "tmpfile" }}
            style={{ width: 1024, height: 1024, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}
          >
            {/* Big QR for high-res export */}
            <View style={{ padding: 32, backgroundColor: "#fff" }}>
              <QRCode value={url || "https://loopcard.app"} size={960} />
            </View>
          </ViewShot>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F7F7F7" }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 6 }}>Your Cards</Text>
      <Text style={{ color: "#666", marginBottom: 16 }}>
        Toggle publish status, edit, preview, share link, or export a QR (PNG).
      </Text>

      {loading ? (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : cards.length === 0 ? (
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
          <Text style={{ color: "#666" }}>No cards found.</Text>
        </View>
      ) : (
        cards.map((c) => <CardItem key={c.id} c={c} />)
      )}
    </ScrollView>
  );
}
