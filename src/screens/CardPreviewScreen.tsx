import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

// Use your LAN IP for local Next.js dev, NOT localhost
const WEB_BASE = "http://192.168.1.42:3000"; // change to your LAN IP or prod domain

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
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
      />
    </View>
  );
}
