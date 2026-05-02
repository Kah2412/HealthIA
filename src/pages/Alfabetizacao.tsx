import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { literacyService } from "@/services/literacyService";
import { ttsService } from "@/services/ttsService";
import { useI18n } from "@/i18n";

const Alfabetizacao = () => {
  const { t, language } = useI18n();
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const items = useMemo(() => literacyService.search(language, query), [language, query]);
  const current = items[Math.min(index, Math.max(0, items.length - 1))];

  const setSafeIndex = (next: number) => setIndex(Math.min(Math.max(0, next), Math.max(0, items.length - 1)));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("literacy.title")} emoji="🔤" />
        <GuideCharacter message={t("literacy.guide")} size="sm" />

        <input
          type="text"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setIndex(0); }}
          placeholder={t("literacy.searchPlaceholder")}
          aria-label={t("literacy.searchPlaceholder")}
          className="w-full p-4 text-xl rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {!current ? (
          <div className="card-elder text-center">
            <p className="text-xl font-bold text-foreground">{t("literacy.noResults")}</p>
          </div>
        ) : (
          <div className="card-elder text-center space-y-6">
            <p className="text-muted-foreground text-lg">{t("literacy.position", { current: Math.min(index + 1, items.length), total: items.length })}</p>

            <motion.button
              key={`${current.syllable}-${current.word}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 1.1 }}
              onClick={() => ttsService.speak(current.syllable, language)}
              className="block mx-auto focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl p-3"
            >
              <span className="text-7xl font-extrabold text-primary block">{current.syllable}</span>
              <span className="text-5xl block mt-2">{current.emoji}</span>
            </motion.button>

            <motion.button
              key={`word-${current.word}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => ttsService.speak(current.word, language)}
              className="block mx-auto focus:outline-none focus:ring-2 focus:ring-ring rounded-2xl p-3"
            >
              <p className="text-4xl font-bold text-foreground tracking-normal break-words">
                {current.word.split("").map((letter, letterIndex) => (
                  <span key={`${letter}-${letterIndex}`} className={letterIndex < 2 ? "text-primary" : ""}>{letter}</span>
                ))}
              </p>
            </motion.button>

            <ElderButton onClick={() => ttsService.speak(`${current.syllable}. ${current.word}`, language)} variant="secondary" fullWidth icon="🔊">
              {t("literacy.listen")}
            </ElderButton>

            <div className="flex gap-3">
              <ElderButton onClick={() => setSafeIndex(index - 1)} variant="accent" fullWidth disabled={index <= 0}>
                {t("literacy.previous")}
              </ElderButton>
              <ElderButton onClick={() => setSafeIndex(index + 1)} variant="primary" fullWidth disabled={index >= items.length - 1}>
                {t("literacy.next")}
              </ElderButton>
            </div>
          </div>
        )}
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Alfabetizacao;
