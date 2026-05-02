import PageHeader from "@/components/PageHeader";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import ElderButton from "@/components/ElderButton";
import { Volume2 } from "lucide-react";
import { ttsService } from "@/services/ttsService";
import { useI18n } from "@/i18n";

const alertItems = [
  { id: 1, textKey: "alerts.item1", dateKey: "alerts.today" },
  { id: 2, textKey: "alerts.item2", dateKey: "alerts.today" },
  { id: 3, textKey: "alerts.item3", dateKey: "alerts.yesterday" },
  { id: 4, textKey: "alerts.item4", dateKey: "alerts.yesterday" },
];

const Avisos = () => {
  const { t, language } = useI18n();

  const listenAll = () => {
    const allTexts = `${t("alerts.intro")} ${alertItems.map((item) => t(item.textKey)).join(". ")}`;
    ttsService.speak(allTexts, language);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("alerts.title")} emoji="📢" />
        <GuideCharacter message={t("alerts.guide")} size="sm" />

        <ElderButton onClick={listenAll} variant="primary" fullWidth>
          <Volume2 className="w-5 h-5 mr-2" />
          {t("alerts.listenAll")}
        </ElderButton>

        <div className="space-y-4">
          {alertItems.map((item) => {
            const text = t(item.textKey);
            return (
              <div key={item.id} className="card-elder flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{t(item.dateKey)}</p>
                  <p className="text-lg font-semibold text-foreground">{text}</p>
                </div>
                <button
                  onClick={() => ttsService.speak(text, language)}
                  className="btn-elder bg-primary text-primary-foreground px-4 py-3"
                  aria-label={t("alerts.listenItem", { text })}
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Avisos;
