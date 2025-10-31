import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { Text, Button, Card, ActivityIndicator, useTheme } from "react-native-paper";
import { supabase } from "../config/supabase";
import PhotoUpload from "../components/PhotoUpload";
import BasicInfoForm from "../components/BasicInfoForm";
import ContactLinksForm from "../components/ContactLinksForm";

export default function CardEditor({ navigation }: any) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [card, setCard] = useState<any>(null);

  // Load user card
  useEffect(() => {
    (async () => {
      try {
        const { data: sess } = await supabase.auth.getSession();
        const uid = sess?.session?.user?.id;
        if (!uid) {
          navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
          return;
        }
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .eq("user_id", uid)
          .single();
        if (error && error.code !== "PGRST116") throw error;
        setCard(data ?? {});
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to load card.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigation]);

  const handleSave = async () => {
    try {
      if (!card) return;
      setSaving(true);
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess?.session?.user?.id;
      if (!uid) return;
      const payload = { ...card, user_id: uid };
      const { error } = await supabase.from("cards").upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
      Alert.alert("Saved", "Your card has been updated.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="titleLarge" style={{ color: colors.onSurface, marginBottom: 10 }}>
        Edit Card
      </Text>

      <Card style={{ backgroundColor: colors.surface, marginBottom: 12 }}>
        <Card.Content>
          <PhotoUpload
            value={card?.avatar_url || card?.photoUri || null}
            onChange={(uri) => setCard((c: any) => ({ ...c, avatar_url: uri }))}
          />
        </Card.Content>
      </Card>

      <Card style={{ backgroundColor: colors.surface, marginBottom: 12 }}>
        <Card.Content>
          <BasicInfoForm
            fullName={card?.full_name || ""}
            businessName={card?.business_name || ""}
            role={card?.role || ""}
            tagline={card?.tagline || ""}
            onChange={(fields) => setCard((c: any) => ({ ...c, ...fields }))}
          />
        </Card.Content>
      </Card>

      <Card style={{ backgroundColor: colors.surface }}>
        <Card.Content>
          <ContactLinksForm
            phone={card?.phone || ""}
            whatsapp={card?.whatsapp || ""}
            email={card?.email || ""}
            website={card?.website || ""}
            linkedin={card?.linkedin || ""}
            twitter={card?.twitter || ""}
            instagram={card?.instagram || ""}
            facebook={card?.facebook || ""}
            onChange={(fields) => setCard((c: any) => ({ ...c, ...fields }))}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        style={{ marginTop: 20 }}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 16 },
});
