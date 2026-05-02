import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useI18n } from "@/i18n";
import LanguageSelector from "@/components/LanguageSelector";

interface PageHeaderProps {
  title: string;
  emoji?: string;
}

const PageHeader = ({ title, emoji }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { highContrast, toggleHighContrast } = useAccessibility();
  const { t } = useI18n();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 py-4 px-2">
      <button
        onClick={() => navigate("/")}
        className="btn-elder bg-muted text-foreground px-5 py-3"
        aria-label={t("common.back")}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 text-center">
        {emoji && <span>{emoji}</span>}
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <LanguageSelector />
        <button
          onClick={toggleHighContrast}
          className={`btn-elder px-5 py-3 ${highContrast ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
          aria-label={t("common.highContrast")}
        >
          <Eye className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
