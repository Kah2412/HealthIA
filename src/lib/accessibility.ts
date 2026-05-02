import { safeStorage } from "@/lib/storage";

export type FontSize = "normal" | "large" | "extra";
export type ThemeMode = "dark" | "light";

export type AccessibilityPreferences = {
  theme: ThemeMode;
  highContrast: boolean;
  fontSize: FontSize;
};

const KEY = "healthia.accessibility";

export const defaultAccessibilityPreferences: AccessibilityPreferences = {
  theme: "dark",
  highContrast: false,
  fontSize: "large",
};

export const loadAccessibilityPreferences = () =>
  safeStorage.get<AccessibilityPreferences>(KEY, defaultAccessibilityPreferences);

export const saveAccessibilityPreferences = (preferences: AccessibilityPreferences) =>
  safeStorage.set(KEY, preferences);

export const applyAccessibilityPreferences = (preferences: AccessibilityPreferences) => {
  const root = document.documentElement;
  root.classList.toggle("dark", preferences.theme === "dark");
  root.classList.toggle("high-contrast", preferences.highContrast);
  root.dataset.fontSize = preferences.fontSize;
};
