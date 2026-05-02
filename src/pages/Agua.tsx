import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { DAILY_WATER_GOAL, hydrationService } from "@/services/hydrationService";
import { ttsService } from "@/services/ttsService";
import { useI18n } from "@/i18n";

const formatCount = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

const Agua = () => {
  const { t, language } = useI18n();
  const [cups, setCups] = useState(() => hydrationService.load().cups);
  const cupsRef = useRef(cups);

  useEffect(() => {
    cupsRef.current = cups;
  }, [cups]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cupsRef.current < DAILY_WATER_GOAL) {
        ttsService.speak(t("water.gentleVoice"), language);
      }
    }, 1000 * 60 * 60 * 2);
    return () => clearInterval(interval);
  }, [language, t]);

  const addWater = (amount: 0.5 | 1) => {
    const next = hydrationService.add(amount);
    setCups(next.cups);
    ttsService.speak(next.cups >= DAILY_WATER_GOAL ? t("water.congratsVoice") : t("water.drankVoice"), language);
  };

  const undo = () => setCups(hydrationService.undo().cups);

  const remaining = Math.max(0, DAILY_WATER_GOAL - cups);
  const progress = (cups / DAILY_WATER_GOAL) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("water.title")} emoji="💧" />

        <GuideCharacter
          message={cups >= DAILY_WATER_GOAL ? t("water.done") : t("water.guide", { count: formatCount(remaining) })}
          size="sm"
        />

        <div className="card-elder bg-secondary/50 border-secondary">
          <p className="text-lg font-semibold text-secondary-foreground">{t("water.reminder")}</p>
        </div>

        <div className="card-elder text-center space-y-4">
          <p className="text-3xl font-bold text-foreground">{t("water.progress", { count: formatCount(cups), goal: DAILY_WATER_GOAL })} 💧</p>
          <p className="text-lg text-muted-foreground">
            {t("water.left", { count: formatCount(remaining) })} {t("water.today", { count: formatCount(cups) })}
          </p>

          <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 80 }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ElderButton onClick={() => addWater(0.5)} variant="secondary" fullWidth disabled={cups >= DAILY_WATER_GOAL}>
              {t("water.halfCup")}
            </ElderButton>
            <ElderButton onClick={() => addWater(1)} variant="primary" fullWidth disabled={cups >= DAILY_WATER_GOAL}>
              {t("water.oneCup")}
            </ElderButton>
          </div>

          <ElderButton onClick={undo} variant="accent" fullWidth disabled={cups <= 0}>
            {t("water.undo")}
          </ElderButton>
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Agua;
