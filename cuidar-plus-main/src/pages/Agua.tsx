import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { falar } from "@/lib/voice";

const META = 8;

const Agua = () => {
  const { t } = useTranslation();
  const [copos, setCopos] = useState(0);
  const coposRef = useRef(copos);

  useEffect(() => {
    coposRef.current = copos;
  }, [copos]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (coposRef.current < META) {
        // Voice message stays in Portuguese as it's audio content
        falar("Que tal beber um pouquinho de água agora? 💧");
      }
    }, 1000 * 60 * 60 * 2);

    return () => clearInterval(interval);
  }, []);

  const beberAgua = () => {
    if (copos < META) {
      setCopos((c) => c + 1);
      if (copos + 1 >= META) {
        falar("Parabéns! Você atingiu a meta de água hoje! 🎉");
      } else {
        falar("Ótimo! Mais um copo de água bebido. 💧");
      }
    }
  };

  const progress = (copos / META) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("agua.title")} emoji="💧" />

        <GuideCharacter
          message={
            copos >= META
              ? t("agua.goalReached")
              : t("agua.goalMessage", { remaining: META - copos })
          }
          size="sm"
        />

        <div className="card-elder bg-secondary/50 border-secondary">
          <p className="text-lg font-semibold text-secondary-foreground">
            {t("agua.reminder")}
          </p>
        </div>

        <div className="card-elder text-center space-y-4">
          <p className="text-3xl font-bold text-foreground">
            {t("agua.progress", { copos, total: META })}
          </p>

          <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 80 }}
            />
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {Array.from({ length: META }).map((_, i) => (
              <span key={i} className={`text-3xl ${i < copos ? "" : "opacity-30"}`}>
                🥛
              </span>
            ))}
          </div>

          <ElderButton
            onClick={beberAgua}
            variant={copos >= META ? "success" : "primary"}
            fullWidth
            icon="💧"
          >
            {copos >= META ? t("agua.goalAchieved") : t("agua.drank")}
          </ElderButton>
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Agua;
