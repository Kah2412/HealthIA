import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { BookResult, searchBooks } from "@/services/booksService";
import { ttsService } from "@/services/ttsService";
import { useI18n } from "@/i18n";

const rates = [
  { key: "books.slow", value: 0.75 },
  { key: "books.normal", value: 0.85 },
  { key: "books.relaxed", value: 0.65 },
];

const Livros = () => {
  const { t, language } = useI18n();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<BookResult[]>([]);
  const [status, setStatus] = useState(t("books.empty"));
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(0.85);

  const runSearch = async () => {
    const term = query.trim();
    if (!term) {
      setBooks([]);
      setStatus(t("books.empty"));
      return;
    }
    setLoading(true);
    setStatus(t("common.searching"));
    try {
      const results = await searchBooks(term, language, t("books.descriptionUnavailable"));
      setBooks(results);
      setStatus(results.length ? t("books.showing", { count: results.length }) : t("books.noResults"));
    } catch (error) {
      console.error("Book search error:", error);
      setBooks([]);
      setStatus(t("books.error"));
    } finally {
      setLoading(false);
    }
  };

  const speakBook = (book: BookResult) => {
    ttsService.setRate(rate);
    ttsService.speak(`${book.title}. ${book.authors.join(", ") || t("books.authorUnavailable")}. ${book.description}`, language);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-3xl mx-auto px-4 space-y-6">
        <PageHeader title={t("books.title")} emoji="📚" />
        <GuideCharacter message={t("books.guide")} size="sm" />

        <div className="space-y-4">
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              placeholder={`🔍 ${t("books.searchPlaceholder")}`}
              aria-label={t("books.searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && runSearch()}
              className="flex-1 p-4 text-xl rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <ElderButton onClick={runSearch} variant="secondary" fullWidth disabled={loading}>
              {loading ? t("common.searching") : t("books.search")}
            </ElderButton>
          </div>

          <div className="card-elder space-y-3">
            <p className="font-bold text-foreground">{t("books.speed")}</p>
            <div className="grid grid-cols-3 gap-2">
              {rates.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => { setRate(item.value); ttsService.setRate(item.value); }}
                  className={`min-h-12 rounded-xl px-3 font-bold focus:outline-none focus:ring-2 focus:ring-ring ${rate === item.value ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                >
                  {t(item.key)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ElderButton onClick={() => ttsService.pause()} variant="accent" fullWidth>{t("books.pause")}</ElderButton>
              <ElderButton onClick={() => ttsService.resume()} variant="secondary" fullWidth>{t("books.continue")}</ElderButton>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{status}</p>

          {books.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {books.map((book, index) => (
                <article key={`${book.title}-${index}`} className="card-elder flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="h-36 w-24 flex-shrink-0 bg-muted rounded-2xl overflow-hidden flex items-center justify-center">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={`${t("books.title")}: ${book.title}`} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-4xl">📚</span>
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h2 className="text-xl font-bold text-foreground break-words leading-tight">{book.title}</h2>
                      <p className="text-muted-foreground break-words">{book.authors.join(", ") || t("books.authorUnavailable")}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("books.source")}: {book.source} · {t("books.language")}: {book.language}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-4">{book.description || t("books.descriptionUnavailable")}</p>
                  <div className="flex flex-col gap-2">
                    <ElderButton onClick={() => speakBook(book)} variant="primary" icon="🔊" fullWidth>{t("books.listen")}</ElderButton>
                    {book.legalReadUrl && (
                      <a href={book.legalReadUrl} target="_blank" rel="noreferrer" className="btn-elder bg-secondary text-secondary-foreground text-center">
                        {book.isPublicDomain ? t("books.publicDomain") : t("books.authorized")} · {t("books.legalRead")}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Livros;
