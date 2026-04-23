import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { falar } from "@/lib/voice";

const silabas = [
  { silaba: "BA", palavra: "BALA", emoji: "🍬" },
  { silaba: "CA", palavra: "CASA", emoji: "🏠" },
  { silaba: "DA", palavra: "DADO", emoji: "🎲" },
  { silaba: "FA", palavra: "FACA", emoji: "🔪" },
  { silaba: "GA", palavra: "GATO", emoji: "🐱" },
  { silaba: "LA", palavra: "LATA", emoji: "🥫" },
  { silaba: "MA", palavra: "MALA", emoji: "💼" },
  { silaba: "NA", palavra: "NAVIO", emoji: "🚢" },
  { silaba: "PA", palavra: "PATO", emoji: "🦆" },
  { silaba: "RA", palavra: "RATO", emoji: "🐭" },
  { silaba: "SA", palavra: "SAPO", emoji: "🐸" },
  { silaba: "TA", palavra: "TATU", emoji: "🦔" },
  { silaba: "VA", palavra: "VACA", emoji: "🐄" },
];

const Alfabetizacao = () => {
  const [idx, setIdx] = useState(0);
  const atual = silabas[idx];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title="Alfabetização" emoji="🔤" />

        <GuideCharacter message="Vamos aprender as letras juntos! Toque para ouvir." size="sm" />

        <div className="card-elder text-center space-y-6">
          <p className="text-muted-foreground text-lg">
            {idx + 1} de {silabas.length}
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
              Ouvir
            </ElderButton>
          </div>

          <div className="flex gap-3">
            <ElderButton
              onClick={() => setIdx(Math.max(0, idx - 1))}
              variant="accent"
              fullWidth
            >
              ← Anterior
            </ElderButton>
            <ElderButton
              onClick={() => setIdx(Math.min(silabas.length - 1, idx + 1))}
              variant="primary"
              fullWidth
            >
              Próximo →
            </ElderButton>
          </div>
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Alfabetizacao;
