import { getSpeechLanguage, Language } from "@/lib/i18n";

let currentRate = 0.85;

const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

const selectVoice = (lang: string) => {
  if (!canSpeak()) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase()) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())) ??
    voices[0] ??
    null
  );
};

export const ttsService = {
  speak(text: string, language: Language = "pt-BR") {
    if (!canSpeak() || !text.trim()) return;
    const lang = getSpeechLanguage(language);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = currentRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = selectVoice(lang);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  },
  pause() {
    if (canSpeak()) window.speechSynthesis.pause();
  },
  resume() {
    if (canSpeak()) window.speechSynthesis.resume();
  },
  stop() {
    if (canSpeak()) window.speechSynthesis.cancel();
  },
  setRate(rate: number) {
    currentRate = Math.min(1.2, Math.max(0.6, rate));
  },
  getRate() {
    return currentRate;
  },
};

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  window.speechSynthesis.getVoices();
}
