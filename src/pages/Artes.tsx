import { ChangeEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { ttsService } from "@/services/ttsService";
import { talentsService } from "@/services/talentsService";
import { useI18n } from "@/i18n";

type Art = "embroidery" | "crochet" | "painting" | null;

const artConfig = [
  { key: "embroidery" as Art, emoji: "🧵", label: "arts.embroidery" },
  { key: "crochet" as Art, emoji: "🧶", label: "arts.crochet" },
  { key: "painting" as Art, emoji: "🎨", label: "arts.painting" },
];

const Artes = () => {
  const { t, dictionary, language } = useI18n();
  const [currentArt, setCurrentArt] = useState<Art>(null);
  const [step, setStep] = useState(0);
  const [pieceName, setPieceName] = useState("");
  const [pieceDate, setPieceDate] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

  const tutorials = dictionary.arts.tutorials;
  const steps = useMemo(() => (currentArt ? tutorials[currentArt] : []), [currentArt, tutorials]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewImage(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => setPreviewImage(null);
    reader.readAsDataURL(file);
  };

  const saveTalent = () => {
    if (!pieceName.trim() || !pieceDate) return;
    talentsService.save({ name: pieceName.trim(), date: pieceDate, imageDataUrl: previewImage ?? undefined });
    setSavedMessage(t("arts.saved", { name: pieceName.trim(), date: pieceDate }));
    setPieceName("");
    setPieceDate("");
    setPreviewImage(null);
  };

  if (!currentArt) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="container max-w-xl mx-auto px-4 space-y-6">
          <PageHeader title={t("arts.title")} emoji="🎨" />
          <GuideCharacter message={t("arts.choose")} size="md" />

          <div className="space-y-4">
            {artConfig.map((item) => (
              <ElderButton key={item.key} onClick={() => { setCurrentArt(item.key); setStep(0); }} variant="accent" icon={item.emoji} fullWidth>
                {t(item.label)}
              </ElderButton>
            ))}
          </div>

          <div className="card-elder space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t("arts.talents")}</h3>
            <input
              type="text"
              placeholder={t("arts.pieceName")}
              aria-label={t("arts.pieceName")}
              value={pieceName}
              onChange={(event) => setPieceName(event.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground text-lg"
            />
            <input
              type="date"
              value={pieceDate}
              onChange={(event) => setPieceDate(event.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground text-lg"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} aria-label={t("arts.noFile")} className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground" />
            {previewImage && <img src={previewImage} alt={pieceName || t("arts.pieceName")} className="w-full h-32 object-cover rounded-md" />}
            <ElderButton onClick={saveTalent} variant="primary" fullWidth>{t("arts.saveTalent")}</ElderButton>
            {savedMessage && <p className="text-sm font-semibold text-success">{savedMessage}</p>}
          </div>

          <div className="card-elder bg-accent/30 text-center space-y-3">
            <p className="text-2xl">🖐️</p>
            <p className="text-xl font-bold text-foreground">{t("arts.motorTitle")}</p>
            <p className="text-muted-foreground">{t("arts.motorDescription")}</p>
            <ElderButton onClick={() => { setCurrentArt("embroidery"); setStep(0); }} variant="primary">
              {t("arts.startTraining")}
            </ElderButton>
          </div>
        </div>
        <EmergencyButton />
      </div>
    );
  }

  const currentConfig = artConfig.find((item) => item.key === currentArt)!;
  const isLast = step >= steps.length - 1;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t(currentConfig.label)} emoji={currentConfig.emoji} />
        <GuideCharacter message={steps[step]} size="md" />

        <div className="card-elder text-center space-y-4">
          <p className="text-muted-foreground text-lg">{t("arts.step", { current: step + 1, total: steps.length })}</p>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
          <p className="text-2xl font-bold text-foreground">{steps[step]}</p>
          <ElderButton onClick={() => ttsService.speak(steps[step], language)} variant="secondary" fullWidth icon="🔊">
            {t("arts.listenInstruction")}
          </ElderButton>
          <div className="flex gap-3">
            <ElderButton onClick={() => setStep(Math.max(0, step - 1))} variant="accent" fullWidth>
              {t("common.repeat")}
            </ElderButton>
            <ElderButton onClick={() => (isLast ? setCurrentArt(null) : setStep(step + 1))} variant="primary" fullWidth>
              {isLast ? t("arts.finish") : t("arts.next")}
            </ElderButton>
          </div>
        </div>

        <ElderButton onClick={() => setCurrentArt(null)} variant="secondary" fullWidth>
          {t("arts.backToArts")}
        </ElderButton>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Artes;
