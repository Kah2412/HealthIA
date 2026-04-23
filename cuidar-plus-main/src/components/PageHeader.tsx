import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface PageHeaderProps {
  title: string;
  emoji?: string;
}

const PageHeader = ({ title, emoji }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <header className="flex items-center justify-between py-4 px-2 gap-2 flex-wrap">
      <button
        onClick={() => navigate("/")}
        className="btn-elder bg-muted text-foreground px-5 py-3"
        aria-label={t("common.back")}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        {emoji && <span>{emoji}</span>}
        {title}
      </h1>
      <div className="flex gap-2">
        <LanguageSwitcher />
        <button
          onClick={toggleHighContrast}
          className={`btn-elder px-5 py-3 ${highContrast ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
          aria-label={t("common.toggleContrast_alt")}
        >
          <Eye className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
