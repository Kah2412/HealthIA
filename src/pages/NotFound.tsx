import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

const NotFound = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="card-elder max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold">{t("notFound.title")}</h1>
        <p className="text-muted-foreground">{t("notFound.description")}</p>
        <Link to="/" className="btn-elder bg-primary text-primary-foreground inline-flex items-center justify-center">
          {t("notFound.home")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
