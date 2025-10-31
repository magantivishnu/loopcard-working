// src/screens/CardPreviewScreen.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

// CHANGE THIS to your web IP during local dev (phone must reach your laptop over LAN)
const WEB_BASE = "http://192.168.29.251:3000"; // e.g. "https://loopcard.app"

export default function CardPreviewScreen({ route }: any) {
  const { slug } = route.params as { slug: string };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <WebView
        source={{ uri: `${WEB_BASE}/c/${slug}` }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#0066FF" />
          </View>
        )}
        // Optional hardening:
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
      />
    </View>
  );
}
