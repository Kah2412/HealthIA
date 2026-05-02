import { Language } from "@/lib/i18n";

export type BookResult = {
  title: string;
  authors: string[];
  description: string;
  coverUrl: string;
  language: string;
  source: string;
  legalReadUrl?: string;
  isPublicDomain: boolean;
};

const SEARCH_LIMIT = 8;

const languageParam: Record<Language, string> = {
  "pt-BR": "por",
  en: "eng",
  es: "spa",
};

const first = <T,>(value: T | T[] | undefined): T | undefined => (Array.isArray(value) ? value[0] : value);

const normalizeDescription = (doc: any, fallback: string) => {
  const sentence = first(doc.first_sentence);
  if (typeof sentence === "string" && sentence.trim()) return sentence;
  if (typeof doc.subtitle === "string" && doc.subtitle.trim()) return doc.subtitle;
  if (Array.isArray(doc.subject) && doc.subject.length) return doc.subject.slice(0, 4).join(", ");
  return fallback;
};

const cover = (doc: any) => (doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : "");

const readUrl = (doc: any) => {
  if (doc.ia?.[0]) return `https://archive.org/details/${doc.ia[0]}`;
  if (doc.key) return `https://openlibrary.org${doc.key}`;
  return undefined;
};

export async function searchBooks(query: string, language: Language, fallbackDescription = ""): Promise<BookResult[]> {
  const term = query.trim();
  if (!term) return [];

  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", term);
  url.searchParams.set("limit", String(SEARCH_LIMIT));
  url.searchParams.set("language", languageParam[language]);
  url.searchParams.set("fields", "key,title,author_name,cover_i,first_sentence,subtitle,subject,language,ia,public_scan_b,ebook_access");

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Book search failed");
  const data = await response.json();
  const docs = Array.isArray(data.docs) ? data.docs : [];

  return docs.slice(0, SEARCH_LIMIT).map((doc: any) => {
    const isPublicDomain = doc.public_scan_b === true || doc.ebook_access === "public";
    return {
      title: doc.title || term,
      authors: Array.isArray(doc.author_name) ? doc.author_name.slice(0, 3) : [],
      description: normalizeDescription(doc, fallbackDescription),
      coverUrl: cover(doc),
      language: Array.isArray(doc.language) ? doc.language[0] : languageParam[language],
      source: "Open Library",
      legalReadUrl: isPublicDomain ? readUrl(doc) : undefined,
      isPublicDomain,
    };
  });
}
