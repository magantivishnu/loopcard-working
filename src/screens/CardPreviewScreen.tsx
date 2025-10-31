// src/screens/CardPreviewScreen.tsx
import React, { useMemo, useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

// ⚠️ Use the SAME IP you set in DashboardHome.tsx
const WEB_BASE = "http://192.168.0.112:3000"; // e.g. http://192.168.1.42:3000

export default function CardPreviewScreen({ route, navigation }: any) {
  const { slug } = route.params as { slug: string };
  const url = useMemo(() => `${WEB_BASE}/c/${slug}`, [slug]);

  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState<null | { code?: number; desc?: string }>(null);

  const onReload = useCallback(() => {
    setFailed(null);
    setLoading(true);
    webRef.current?.reload();
  }, []);

  const onShare = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(url);
      Alert.alert("Link copied", "Public card link copied to clipboard.");
    } catch (e) {
      Alert.alert("Unable to copy", String(e));
    }
  }, [url]);

  const onOpenExternal = useCallback(async () => {
    const ok = await Linking.canOpenURL(url);
    if (!ok) return Alert.alert("Cannot open", url);
    Linking.openURL(url);
  }, [url]);

  // Prevent pinch-zoom for a more app-like feel
  const injectedJS = `
    (function() {
      try {
        var meta = document.querySelector('meta[name=viewport]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'viewport';
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      } catch(e) {}
    })();
    true;
  `;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* In-app toolbar */}
      <View
        style={{
          height: 52,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderColor: "#eee",
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 6, marginRight: 6 }}
        >
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text numberOfLines={1} style={{ flex: 1, textAlign: "center", fontWeight: "600" }}>
          Preview
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={onShare} style={{ padding: 6, marginRight: 2 }}>
            <Ionicons name="copy-outline" size={22} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenExternal} style={{ padding: 6, marginRight: 2 }}>
            <Ionicons name="open-outline" size={22} color="#111" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onReload} style={{ padding: 6 }}>
            <Ionicons name="refresh-outline" size={22} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView */}
      {!failed ? (
        <View style={{ flex: 1 }}>
          <WebView
            ref={webRef}
            source={{ uri: url }}
            startInLoadingState
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={(e) => {
              setLoading(false);
              setFailed({ code: e.nativeEvent.code, desc: e.nativeEvent.description });
            }}
            onHttpError={(e) => {
              setLoading(false);
              setFailed({ code: e.nativeEvent.statusCode, desc: `HTTP ${e.nativeEvent.statusCode}` });
            }}
            javaScriptEnabled
            domStorageEnabled
            injectedJavaScript={injectedJS}
            bounces={false}
            allowsBackForwardNavigationGestures
          />

          {loading && (
            <View
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            >
              <ActivityIndicator size="large" color="#0066FF" />
            </View>
          )}
        </View>
      ) : (
        // Friendly error UI
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Ionicons name="cloud-offline-outline" size={42} color="#666" />
          <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600" }}>Couldn’t load the card</Text>
          {!!failed.desc && (
            <Text style={{ marginTop: 6, color: "#666", textAlign: "center" }}>{failed.desc}</Text>
          )}
          <TouchableOpacity
            onPress={onReload}
            style={{
              marginTop: 16,
              backgroundColor: "#0066FF",
              paddingVertical: 10,
              paddingHorizontal: 18,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
