import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface PageHeaderProps {
  title: string;
  emoji?: string;
}

const PageHeader = ({ title, emoji }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { highContrast, toggleHighContrast } = useAccessibility();

  return (
    <header className="flex items-center justify-between py-4 px-2">
      <button
        onClick={() => navigate("/")}
        className="btn-elder bg-muted text-foreground px-5 py-3"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
        {emoji && <span>{emoji}</span>}
        {title}
      </h1>
      <button
        onClick={toggleHighContrast}
        className={`btn-elder px-5 py-3 ${highContrast ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
        aria-label="Alternar alto contraste"
      >
        <Eye className="w-6 h-6" />
      </button>
    </header>
  );
};

export default PageHeader;
