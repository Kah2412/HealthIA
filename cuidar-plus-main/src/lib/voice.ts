// src/lib/voice.ts

// Idiomas suportados
export type SupportedLanguage = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'it-IT';

const VOICE_CONFIG = {
  rate: 0.7,
  pitch: 1.0,
  volume: 1,
};

const PREFERRED_VOICES = [
  'Google',
  'Microsoft',
  'Natural',
  'Apple',
  'Microsoft Zira',
  'Microsoft David',
];

const selectVoice = (language: string): SpeechSynthesisVoice | null => {
  const voices = speechSynthesis.getVoices();
  const normalizedLang = language.toLowerCase();

  let voice = voices.find(
    (v) => v.lang.toLowerCase().startsWith(normalizedLang) &&
      PREFERRED_VOICES.some((name) => v.name.includes(name))
  );

  if (!voice) {
    voice = voices.find((v) => v.lang.toLowerCase().startsWith(normalizedLang));
  }

  if (!voice) {
    voice = voices.find((v) =>
      PREFERRED_VOICES.some((name) => v.name.includes(name))
    );
  }

  return voice || voices[0] || null;
};

// Função global de voz
export const falar = (texto: string, idioma: SupportedLanguage = 'pt-BR') => {
  // Cancelar fala anterior para evitar sobreposição
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = idioma;
  utterance.rate = VOICE_CONFIG.rate;
  utterance.pitch = VOICE_CONFIG.pitch;
  utterance.volume = VOICE_CONFIG.volume;

  // Selecionar voz
  const voice = selectVoice(idioma);
  if (voice) {
    utterance.voice = voice;
  }

  speechSynthesis.speak(utterance);
};

// Garantir carregamento de vozes
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
  };
  speechSynthesis.getVoices();
}