// src/navigation/TabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import DashboardHome from "../screens/DashboardHome";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import EditCardScreen from "../screens/CardEditor";
import SettingsScreen from "../screens/SettingsScreen";

export type TabParamList = {
  Home: undefined;
  Analytics: undefined;
  EditCard: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0066FF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          borderTopColor: "#E5E7EB",
          backgroundColor: "#FFFFFF",
        },
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === "Home" ? "home-outline" :
            route.name === "Analytics" ? "stats-chart-outline" :
            route.name === "EditCard" ? "create-outline" :
            route.name === "Settings" ? "settings-outline" :
            "ellipse-outline";
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardHome} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarLabel: "Analytics" }} />
      <Tab.Screen name="EditCard" component={EditCardScreen} options={{ tabBarLabel: "Edit Card" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: "Settings" }} />
    </Tab.Navigator>
  );
}
