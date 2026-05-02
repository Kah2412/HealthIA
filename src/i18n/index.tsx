import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import pt from "./pt";
import en from "./en";
import es from "./es";
import { Language } from "@/lib/i18n";
import { safeStorage } from "@/lib/storage";

const dictionaries = { "pt-BR": pt, en, es };
const LANGUAGE_KEY = "healthia.language";

type Dictionary = typeof pt;
type Params = Record<string, string | number>;

type I18nContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Params) => string;
  dictionary: Dictionary;
};

const I18nContext = createContext<I18nContextType | null>(null);

const getValue = (dictionary: Dictionary, key: string): unknown =>
  key.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, dictionary);

const interpolate = (value: string, params?: Params) =>
  Object.entries(params ?? {}).reduce(
    (text, [key, replacement]) => text.replaceAll(`{${key}}`, String(replacement)),
    value
  );

const detectInitialLanguage = (): Language => {
  const stored = safeStorage.get<Language | null>(LANGUAGE_KEY, null);
  if (stored && stored in dictionaries) return stored;
  return "pt-BR";
};

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    safeStorage.set(LANGUAGE_KEY, next);
  };

  const value = useMemo<I18nContextType>(() => {
    const dictionary = dictionaries[language];
    return {
      language,
      setLanguage,
      dictionary,
      t: (key, params) => {
        const translated = getValue(dictionary, key) ?? getValue(pt, key);
        if (typeof translated === "string") return interpolate(translated, params);
        return key;
      },
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
};

export type { Dictionary };
