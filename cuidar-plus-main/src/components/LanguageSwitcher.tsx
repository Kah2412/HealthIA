import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => i18n.changeLanguage("pt")}
        className={`btn-elder px-4 py-2 text-sm font-bold ${
          i18n.language === "pt"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
        aria-label="Portuguese"
      >
        PT
      </button>
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`btn-elder px-4 py-2 text-sm font-bold ${
          i18n.language === "en"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
        aria-label="English"
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage("es")}
        className={`btn-elder px-4 py-2 text-sm font-bold ${
          i18n.language === "es"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
        aria-label="Spanish"
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
