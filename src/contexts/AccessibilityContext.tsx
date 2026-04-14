import React, { createContext, useContext, useState, useCallback } from "react";

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  highContrast: false,
  toggleHighContrast: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);

  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("high-contrast");
      } else {
        document.documentElement.classList.remove("high-contrast");
      }
      return next;
    });
  }, []);

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
