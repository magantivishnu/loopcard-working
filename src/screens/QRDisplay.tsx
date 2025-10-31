import React, { useEffect, useState } from "react";
import { View, StyleSheet, Share } from "react-native";
import { Card, Text, Button, useTheme, ActivityIndicator } from "react-native-paper";
import QRCode from "react-native-qrcode-svg";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../config/supabase";

const PUBLIC_BASE = "https://loopcard.app/u";

export default function QRDisplay() {
  const { colors } = useTheme();
  const [slug, setSlug] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess?.session?.user?.id;
      if (!uid) return setLoading(false);
      const { data } = await supabase
        .from("cards")
        .select("slug")
        .eq("user_id", uid)
        .single();
      setSlug(data?.slug || "");
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const url = slug ? `${PUBLIC_BASE}/${slug}` : "";
  const qrImageUrl = url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(url)}`
    : "";

  const onShare = async () => {
    if (!url) return;
    await Share.share({ message: `My LoopCard: ${url}` });
  };

  const onDownload = async () => {
    if (!qrImageUrl) return;
    await WebBrowser.openBrowserAsync(qrImageUrl); // user saves image from browser
  };

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title title="Your QR Code" titleStyle={{ color: colors.onSurface }} />
        <Card.Content style={styles.content}>
          {url ? (
            <>
              <View style={styles.qrBox}>
                <QRCode value={url} size={220} />
              </View>
              <Text style={{ color: colors.onSurfaceVariant, textAlign: "center", marginTop: 8 }}>
                {url}
              </Text>
              <View style={styles.row}>
                <Button icon="download" mode="contained" onPress={onDownload}>
                  Download
                </Button>
                <Button icon="share-variant" mode="outlined" onPress={onShare}>
                  Share
                </Button>
              </View>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 12, marginTop: 8, textAlign: "center" }}>
                Tip: “Download” opens the QR image in your browser so you can save it.
              </Text>
            </>
          ) : (
            <Text style={{ color: colors.onSurfaceVariant }}>No card found.</Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16, alignItems: "center", justifyContent: "center" },
  card: { width: "100%" },
  content: { alignItems: "center" },
  qrBox: { padding: 12, borderRadius: 12, backgroundColor: "#fff" },
  row: { flexDirection: "row", gap: 10, marginTop: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
