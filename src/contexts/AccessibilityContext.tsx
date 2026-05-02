import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  AccessibilityPreferences,
  applyAccessibilityPreferences,
  defaultAccessibilityPreferences,
  FontSize,
  loadAccessibilityPreferences,
  saveAccessibilityPreferences,
  ThemeMode,
} from "@/lib/accessibility";

interface AccessibilityContextType {
  highContrast: boolean;
  theme: ThemeMode;
  fontSize: FontSize;
  toggleHighContrast: () => void;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (fontSize: FontSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  highContrast: defaultAccessibilityPreferences.highContrast,
  theme: defaultAccessibilityPreferences.theme,
  fontSize: defaultAccessibilityPreferences.fontSize,
  toggleHighContrast: () => {},
  setTheme: () => {},
  setFontSize: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(loadAccessibilityPreferences);

  useEffect(() => {
    applyAccessibilityPreferences(preferences);
    saveAccessibilityPreferences(preferences);
  }, [preferences]);

  const toggleHighContrast = useCallback(() => {
    setPreferences((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setPreferences((prev) => ({ ...prev, theme }));
  }, []);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setPreferences((prev) => ({ ...prev, fontSize }));
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast: preferences.highContrast,
        theme: preferences.theme,
        fontSize: preferences.fontSize,
        toggleHighContrast,
        setTheme,
        setFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
