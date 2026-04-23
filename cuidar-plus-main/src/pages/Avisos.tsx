import PageHeader from "@/components/PageHeader";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import ElderButton from "@/components/ElderButton";
import { Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { falar } from "@/lib/voice";

const Avisos = () => {
  const { t } = useTranslation();

  const avisos = [
    { id: 1, texto: t("avisos.notice1"), data: t("avisos.today") },
    { id: 2, texto: t("avisos.notice2"), data: t("avisos.today") },
    { id: 3, texto: t("avisos.notice3"), data: t("avisos.yesterday") },
    { id: 4, texto: t("avisos.notice4"), data: t("avisos.yesterday") },
  ];

  const ouvirTodos = () => {
    const todosTextos = `Vamos ouvir seus avisos com calma. ${avisos.map((a) => a.texto).join('. ')}`;
    falar(todosTextos, "pt-BR");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("avisos.title")} emoji="📢" />

        <GuideCharacter message={t("avisos.description")} size="sm" />

        <ElderButton onClick={ouvirTodos} variant="primary" fullWidth>
          <Volume2 className="w-5 h-5 mr-2" />
          {t("avisos.listenAll")}
        </ElderButton>

        <div className="space-y-4">
          {avisos.map((a) => (
            <div key={a.id} className="card-elder flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">{a.data}</p>
                <p className="text-lg font-semibold text-foreground">{a.texto}</p>
              </div>
              <button
                onClick={() => falar(`Aviso: ${a.texto}`, "pt-BR")}
                className="btn-elder bg-primary text-primary-foreground px-4 py-3"
                aria-label={`Listen: ${a.texto}`}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Avisos;
