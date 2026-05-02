import { ttsService } from "@/services/ttsService";

export type SupportedLanguage = "pt-BR" | "en-US" | "es-ES";

const mapSpeechToAppLanguage = (language: SupportedLanguage) => {
  if (language.startsWith("en")) return "en";
  if (language.startsWith("es")) return "es";
  return "pt-BR";
};

export const falar = (texto: string, idioma: SupportedLanguage = "pt-BR") => {
  ttsService.speak(texto, mapSpeechToAppLanguage(idioma));
};
