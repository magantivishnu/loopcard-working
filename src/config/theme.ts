// src/config/theme.ts
import { MD3DarkTheme, configureFonts } from "react-native-paper";

export const colors = {
  // navy/grey base palette
  background: "#0F172A",   // deep navy background
  surface: "#0B1220",      // darker surface
  surface2: "#0F2344",     // lighter surface for cards
  primary: "#22C55E",      // green accent
  primaryVariant: "#16A34A",
  secondary: "#38BDF8",    // blue accent
  outline: "#334155",      // grey border
  text: "#FFFFFF",
  textMuted: "#A3AED0",
  link: "#7DD3FC",
  danger: "#EF4444",
};

const fonts = configureFonts({
  config: {
    fontFamily: undefined, // use system font stack
  },
});

export const paperTheme = {
  ...MD3DarkTheme,
  dark: true,
  roundness: 10,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    onPrimary: "#00140A",
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,   // keep only this
    outline: colors.outline,
    onSurface: colors.text,
    onSurfaceVariant: colors.textMuted,
    error: colors.danger,
  },
  fonts,
} as const;
