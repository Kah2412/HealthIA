import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { falar } from "@/lib/voice";

const Alfabetizacao = () => {
  const { t } = useTranslation();

  const silabas = [
    { silaba: t("alfabetizacao.syllables.ba"), palavra: t("alfabetizacao.syllables.bala"), emoji: "🍬" },
    { silaba: t("alfabetizacao.syllables.ca"), palavra: t("alfabetizacao.syllables.casa"), emoji: "🏠" },
    { silaba: t("alfabetizacao.syllables.da"), palavra: t("alfabetizacao.syllables.dado"), emoji: "🎲" },
    { silaba: t("alfabetizacao.syllables.fa"), palavra: t("alfabetizacao.syllables.faca"), emoji: "🔪" },
    { silaba: t("alfabetizacao.syllables.ga"), palavra: t("alfabetizacao.syllables.gato"), emoji: "🐱" },
    { silaba: t("alfabetizacao.syllables.la"), palavra: t("alfabetizacao.syllables.lata"), emoji: "🥫" },
    { silaba: t("alfabetizacao.syllables.ma"), palavra: t("alfabetizacao.syllables.mala"), emoji: "💼" },
    { silaba: t("alfabetizacao.syllables.na"), palavra: t("alfabetizacao.syllables.navio"), emoji: "🚢" },
    { silaba: t("alfabetizacao.syllables.pa"), palavra: t("alfabetizacao.syllables.pato"), emoji: "🦆" },
    { silaba: t("alfabetizacao.syllables.ra"), palavra: t("alfabetizacao.syllables.rato"), emoji: "🐭" },
    { silaba: t("alfabetizacao.syllables.sa"), palavra: t("alfabetizacao.syllables.sapo"), emoji: "🐸" },
    { silaba: t("alfabetizacao.syllables.ta"), palavra: t("alfabetizacao.syllables.tatu"), emoji: "🦔" },
    { silaba: t("alfabetizacao.syllables.va"), palavra: t("alfabetizacao.syllables.vaca"), emoji: "🐄" },
  ];

  const [idx, setIdx] = useState(0);
  const atual = silabas[idx];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("alfabetizacao.title")} emoji="🔤" />

        <GuideCharacter message={t("alfabetizacao.description")} size="sm" />

        <div className="card-elder text-center space-y-6">
          <p className="text-muted-foreground text-lg">
            {t("alfabetizacao.progress", { current: idx + 1, total: silabas.length })}
          </p>

          {/* Big syllable display */}
          <motion.button
            key={idx}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 1.1 }}
            onClick={() => falar(atual.silaba)}
            className="block mx-auto"
          >
            <span className="text-7xl font-extrabold text-primary block">
              {atual.silaba}
            </span>
            <span className="text-5xl block mt-2">{atual.emoji}</span>
          </motion.button>

          {/* Word */}
          <motion.button
            key={`word-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => falar(atual.palavra)}
            className="block mx-auto"
          >
            <p className="text-4xl font-bold text-foreground tracking-widest">
              {atual.palavra.split("").map((letter, i) => (
                <span key={i} className={i < 2 ? "text-primary" : ""}>
                  {letter}
                </span>
              ))}
            </p>
          </motion.button>

          <div className="flex gap-3">
            <ElderButton
              onClick={() => falar(`${atual.silaba}. ${atual.palavra}`)}
              variant="secondary"
              fullWidth
              icon="🔊"
            >
              {t("alfabetizacao.listen")}
            </ElderButton>
          </div>

          <div className="flex gap-3">
            <ElderButton
              onClick={() => setIdx(Math.max(0, idx - 1))}
              variant="accent"
              fullWidth
            >
              {t("common.previous")}
            </ElderButton>
            <ElderButton
              onClick={() => setIdx(Math.min(silabas.length - 1, idx + 1))}
              variant="primary"
              fullWidth
            >
              {t("common.next")}
            </ElderButton>
          </div>
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Alfabetizacao;
