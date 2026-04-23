import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { toast } from "@/hooks/use-toast";

const Lazer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const atividades = [
    { nome: t("lazer.menu.truco"), emoji: "🃏", path: "/lazer/truco" },
    { nome: t("lazer.menu.paciencia"), emoji: "♠️", path: "/lazer/paciencia" },
    { nome: t("lazer.menu.domino"), emoji: "🁣", action: true },
    { nome: t("lazer.menu.musica"), emoji: "🎵", action: true },
    { nome: t("lazer.menu.leitura"), emoji: "📖", path: "/livros" },
    { nome: t("lazer.menu.desenho"), emoji: "✏️", action: true },
  ];

  const handleParticipate = (nome: string) => {
    toast({
      title: t("lazer.celebration"),
      description: t("lazer.participationMessage", { nome }),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("lazer.title")} emoji="🎲" />

        <GuideCharacter message={t("lazer.description")} size="sm" />

        <div className="grid grid-cols-2 gap-4">
          {atividades.map((a, i) => (
            <motion.div
              key={a.nome}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="card-elder text-center space-y-3">
                <span className="text-4xl block">{a.emoji}</span>
                <p className="text-xl font-bold text-foreground">{a.nome}</p>
                <ElderButton
                  onClick={() =>
                    a.path ? navigate(a.path) : handleParticipate(a.nome)
                  }
                  variant="primary"
                  fullWidth
                >
                  {a.path ? t("lazer.play") : t("lazer.participate")}
                </ElderButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Lazer;
