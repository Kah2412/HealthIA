export type Language = "pt-BR" | "en" | "es";

export const languages: { code: Language; label: string; speech: string }[] = [
  { code: "pt-BR", label: "PT", speech: "pt-BR" },
  { code: "en", label: "EN", speech: "en-US" },
  { code: "es", label: "ES", speech: "es-ES" },
];

export const getSpeechLanguage = (language: Language) =>
  languages.find((item) => item.code === language)?.speech ?? "pt-BR";
