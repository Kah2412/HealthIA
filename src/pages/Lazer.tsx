import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { toast } from "@/hooks/use-toast";

const atividades = [
  { nome: "Truco", emoji: "🃏", path: "/lazer/truco" },
  { nome: "Paciência", emoji: "♠️", path: "/lazer/paciencia" },
  { nome: "Dominó", emoji: "🁣", action: true },
  { nome: "Música", emoji: "🎵", action: true },
  { nome: "Leitura", emoji: "📖", path: "/livros" },
  { nome: "Desenho", emoji: "✏️", action: true },
];

const Lazer = () => {
  const navigate = useNavigate();

  const handleParticipate = (nome: string) => {
    toast({
      title: `🎉 Oba!`,
      description: `Você quer participar de ${nome}! Fale com o cuidador.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title="Lazer" emoji="🎲" />

        <GuideCharacter message="Hora de se divertir! Escolha uma atividade." size="sm" />

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
                  {a.path ? "Jogar" : "Quero participar"}
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
