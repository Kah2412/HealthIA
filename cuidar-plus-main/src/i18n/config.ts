import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptJSON from '@/locales/pt.json';
import enJSON from '@/locales/en.json';
import esJSON from '@/locales/es.json';

const resources = {
  pt: { translation: ptJSON },
  en: { translation: enJSON },
  es: { translation: esJSON },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
