import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n";

const activities = [
  { key: "leisure.truco", emoji: "🃏", path: "/lazer/truco" },
  { key: "leisure.solitaire", emoji: "♠️", path: "/lazer/paciencia" },
  { key: "leisure.dominoes", emoji: "▣", action: true },
  { key: "leisure.music", emoji: "🎵", action: true },
  { key: "leisure.reading", emoji: "📖", path: "/livros" },
  { key: "leisure.drawing", emoji: "✏️", action: true },
];

const Lazer = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleParticipate = (name: string) => {
    toast({ title: t("leisure.toastTitle"), description: t("leisure.toastDescription", { name }) });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("leisure.title")} emoji="🎲" />
        <GuideCharacter message={t("leisure.guide")} size="sm" />

        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity, i) => {
            const name = t(activity.key);
            return (
              <motion.div key={activity.key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                <div className="card-elder text-center space-y-3">
                  <span className="text-4xl block">{activity.emoji}</span>
                  <p className="text-xl font-bold text-foreground">{name}</p>
                  <ElderButton onClick={() => (activity.path ? navigate(activity.path) : handleParticipate(name))} variant="primary" fullWidth>
                    {activity.path ? t("leisure.play") : t("leisure.participate")}
                  </ElderButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Lazer;
