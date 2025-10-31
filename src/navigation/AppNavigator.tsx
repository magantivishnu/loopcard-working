// src/navigation/AppNavigator.tsx
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "./types";

import WelcomeScreen from "../screens/WelcomeScreen";
import SignupScreen from "../screens/SignupScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen";
import SetupWizard from "../screens/SetupWizard";
import QRDisplay from "../screens/QRDisplay";
import TabNavigator from "./TabNavigator";
import CardPreviewScreen from "../screens/CardPreviewScreen"; // ✅ WebView preview

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
}

function AppRootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainTabs">
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="QRDisplay" component={QRDisplay} />
      <Stack.Screen name="SetupWizard" component={SetupWizard} />
      {/* ✅ In-app Card preview */}
      <Stack.Screen
        name="CardPreview"
        component={CardPreviewScreen}
        options={{
          headerShown: true,
          title: "Preview",
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0F172A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return <NavigationContainer>{user ? <AppRootStack /> : <AuthStack />}</NavigationContainer>;
}
