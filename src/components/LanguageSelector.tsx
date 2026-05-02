import { languages } from "@/lib/i18n";
import { useI18n } from "@/i18n";

const LanguageSelector = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-2xl border border-border bg-card p-1" aria-label={t("common.language")}>
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLanguage(item.code)}
          className={`min-h-11 min-w-12 rounded-xl px-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-ring ${
            language === item.code ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          }`}
          aria-pressed={language === item.code}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
