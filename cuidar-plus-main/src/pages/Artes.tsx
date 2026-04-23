import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { Volume2 } from "lucide-react";
import { falar } from "@/lib/voice";

type Arte = "bordado" | "croche" | "pintura" | null;

const Artes = () => {
  const { t } = useTranslation();
  
  const tutoriais: Record<"bordado" | "croche" | "pintura", string[]> = {
    bordado: [
      t("artes.embroidery_instructions.step1"),
      t("artes.embroidery_instructions.step2"),
      t("artes.embroidery_instructions.step3"),
      t("artes.embroidery_instructions.step4"),
      t("artes.embroidery_instructions.step5"),
      t("artes.embroidery_instructions.step6"),
      t("artes.embroidery_instructions.step7"),
      t("artes.embroidery_instructions.complete"),
    ],
    croche: [
      t("artes.crochet_instructions.step1"),
      t("artes.crochet_instructions.step2"),
      t("artes.crochet_instructions.step3"),
      t("artes.crochet_instructions.step4"),
      t("artes.crochet_instructions.step5"),
      t("artes.crochet_instructions.step6"),
      t("artes.crochet_instructions.step7"),
      t("artes.crochet_instructions.complete"),
    ],
    pintura: [
      t("artes.painting_instructions.step1"),
      t("artes.painting_instructions.step2"),
      t("artes.painting_instructions.step3"),
      t("artes.painting_instructions.step4"),
      t("artes.painting_instructions.step5"),
      t("artes.painting_instructions.step6"),
      t("artes.painting_instructions.step7"),
      t("artes.painting_instructions.complete"),
    ],
  };

  const [arteAtual, setArteAtual] = useState<Arte>(null);
  const [passo, setPasso] = useState(0);
  const [nomePeca, setNomePeca] = useState("");
  const [dataPeca, setDataPeca] = useState("");
  const [imagemPeca, setImagemPeca] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);
  const [mensagemSalvo, setMensagemSalvo] = useState("");

  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setImagemPeca(null);
      setPreviewImagem(null);
      return;
    }

    setImagemPeca(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImagem(reader.result);
      } else {
        setPreviewImagem(null);
      }
    };
    reader.onerror = () => {
      setPreviewImagem(null);
    };
    reader.readAsDataURL(file);
  };

  const salvarTalento = () => {
    if (nomePeca.trim() && dataPeca) {
      setMensagemSalvo(t("artes.saved", { nome: nomePeca.trim(), data: dataPeca }));
      setNomePeca("");
      setDataPeca("");
      setImagemPeca(null);
      setPreviewImagem(null);
    }
  };

  if (!arteAtual) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="container max-w-xl mx-auto px-4 space-y-6">
          <PageHeader title={t("artes.title")} emoji="🎨" />
          <GuideCharacter message={t("artes.description")} size="md" />

          <div className="space-y-4">
            {([
              { key: "bordado" as Arte, emoji: "🧵", label: t("artes.menu.embroidery") },
              { key: "croche" as Arte, emoji: "🧶", label: t("artes.menu.crochet") },
              { key: "pintura" as Arte, emoji: "🎨", label: t("artes.menu.painting") },
            ]).map((item) => (
              <ElderButton
                key={item.key}
                onClick={() => { setArteAtual(item.key); setPasso(0); }}
                variant="accent"
                icon={item.emoji}
                fullWidth
              >
                {item.label}
              </ElderButton>
            ))}
          </div>

          {/* My talents */}
          <div className="card-elder space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t("artes.myTalents")}</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder={t("artes.artName")}
                value={nomePeca}
                onChange={(e) => setNomePeca(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              />
              <input
                type="date"
                value={dataPeca}
                onChange={(e) => setDataPeca(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              />
              {previewImagem && (
                <img src={previewImagem} alt="Preview" className="w-full h-32 object-cover rounded-md" />
              )}
              <ElderButton onClick={salvarTalento} variant="primary" fullWidth>
                {t("artes.saveTalent")}
              </ElderButton>
              {mensagemSalvo && (
                <p className="text-sm text-green-600">{mensagemSalvo}</p>
              )}
            </div>
          </div>

          {/* Motor training teaser */}
          <div className="card-elder bg-accent/30 text-center space-y-3">
            <p className="text-2xl">{t("artes.motorTraining")}</p>
            <p className="text-xl font-bold text-foreground"></p>
            <p className="text-muted-foreground">{t("artes.motorDescription")}</p>
            <ElderButton onClick={() => { setArteAtual("bordado"); setPasso(0); }} variant="primary">
              {t("artes.startTraining")}
            </ElderButton>
          </div>
        </div>
        <EmergencyButton />
      </div>
    );
  }

  const passos = tutoriais[arteAtual];
  const isLast = passo >= passos.length - 1;
  const getTitleEmoji = () => {
    if (arteAtual === "croche") return "🧶";
    if (arteAtual === "bordado") return "🧵";
    return "🎨";
  };

  const getTitleText = () => {
    if (arteAtual === "croche") return t("artes.menu.crochet");
    if (arteAtual === "bordado") return t("artes.menu.embroidery");
    return t("artes.menu.painting");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader
          title={getTitleText()}
          emoji={getTitleEmoji()}
        />

        <GuideCharacter message={passos[passo]} size="md" />

        <div className="card-elder text-center space-y-4">
          <p className="text-muted-foreground text-lg">
            {t("artes.step", { current: passo + 1, total: passos.length })}
          </p>

          {/* Progress */}
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${((passo + 1) / passos.length) * 100}%` }}
            />
          </div>

          <p className="text-2xl font-bold text-foreground">{passos[passo]}</p>

          <div className="flex flex-col gap-3">
            <ElderButton onClick={() => falar(passos[passo])} variant="secondary" fullWidth icon="🔊">
              {t("artes.listenInstruction")}
            </ElderButton>

            <div className="flex gap-3">
              <ElderButton
                onClick={() => setPasso(Math.max(0, passo - 1))}
                variant="accent"
                fullWidth
              >
                {t("artes.repeat")}
              </ElderButton>
              <ElderButton
                onClick={() => {
                  if (isLast) {
                    setArteAtual(null);
                  } else {
                    setPasso(passo + 1);
                  }
                }}
                variant="primary"
                fullWidth
              >
                {isLast ? t("artes.finish") : t("common.next")}
              </ElderButton>
            </div>
          </div>
        </div>

        <ElderButton onClick={() => setArteAtual(null)} variant="secondary" fullWidth>
          {t("artes.backToArts")}
        </ElderButton>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Artes;
