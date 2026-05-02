import { Language } from "@/lib/i18n";

export type LiteracyItem = {
  syllable: string;
  word: string;
  emoji: string;
  sound: string;
};

const data: Record<Language, LiteracyItem[]> = {
  "pt-BR": [
    { syllable: "BA", word: "BALA", emoji: "🍬", sound: "ba" },
    { syllable: "CA", word: "CASA", emoji: "🏠", sound: "ca" },
    { syllable: "MA", word: "MALA", emoji: "💼", sound: "ma" },
    { syllable: "PA", word: "PATO", emoji: "🦆", sound: "pa" },
    { syllable: "BO", word: "BOLA", emoji: "⚽", sound: "bo" },
  ],
  en: [
    { syllable: "BA", word: "BALL", emoji: "⚽", sound: "ba" },
    { syllable: "CA", word: "CAT", emoji: "🐱", sound: "ca" },
    { syllable: "MA", word: "MAP", emoji: "🗺️", sound: "ma" },
    { syllable: "PA", word: "PAN", emoji: "🍳", sound: "pa" },
    { syllable: "BO", word: "BOOK", emoji: "📚", sound: "bo" },
  ],
  es: [
    { syllable: "BA", word: "BALA", emoji: "🍬", sound: "ba" },
    { syllable: "CA", word: "CASA", emoji: "🏠", sound: "ca" },
    { syllable: "MA", word: "MAMÁ", emoji: "👩", sound: "ma" },
    { syllable: "PA", word: "PATO", emoji: "🦆", sound: "pa" },
    { syllable: "BO", word: "BOLA", emoji: "⚽", sound: "bo" },
  ],
};

export const literacyService = {
  list(language: Language) {
    return data[language];
  },
  search(language: Language, query: string) {
    const normalized = query.trim().toLocaleLowerCase();
    const items = data[language];
    if (!normalized) return items;
    return items.filter((item) =>
      [item.syllable, item.word, item.sound].some((value) => value.toLocaleLowerCase().includes(normalized))
    );
  },
};
