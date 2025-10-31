import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, Button, Card, useTheme } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Confirm", "Sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Title title="Settings" titleStyle={{ color: colors.onSurface }} />
        <Card.Content>
          <Text style={{ color: colors.onSurfaceVariant }}>
            Logged in as: {user?.email ?? "Unknown"}
          </Text>
          <Button
            mode="outlined"
            style={{ marginTop: 20 }}
            onPress={handleLogout}
            textColor={colors.error}
          >
            Sign Out
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  card: { width: "100%" },
});
