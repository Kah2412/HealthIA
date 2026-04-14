import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { Volume2 } from "lucide-react";
import { falar } from "@/lib/voice";

type Arte = "bordado" | "croche" | "pintura" | null;

const tutoriais: Record<"bordado" | "croche" | "pintura", string[]> = {
  bordado: [
    "Pegue a agulha e a linha com calma.",
    "Passe a linha pelo buraquinho da agulha.",
    "Faça um nó na ponta da linha.",
    "Espete a agulha no tecido de baixo pra cima.",
    "Puxe a linha toda até o nó segurar.",
    "Agora espete ao lado, de cima pra baixo.",
    "Continue fazendo pontos lado a lado.",
    "Parabéns! Você está bordando! 🎉",
  ],
  croche: [
    "Segure a agulha de crochê com a mão que escreve.",
    "Faça um laço com a linha no dedo.",
    "Passe a agulha pelo laço e puxe.",
    "Isso é uma corrente! Continue fazendo mais.",
    "Para o ponto baixo, espete na corrente.",
    "Puxe a linha e feche o ponto.",
    "Repita em cada corrente da fileira.",
    "Maravilha! Você está fazendo crochê! 🧶",
  ],
  pintura: [
    "Escolha as cores que mais gosta.",
    "Molhe o pincel na água.",
    "Passe o pincel na tinta com carinho.",
    "Faça traços leves no papel.",
    "Pinte formas simples: círculos, linhas.",
    "Misture cores para criar novas!",
    "Deixe secar antes de tocar.",
    "Que lindo! Sua pintura ficou maravilhosa! 🎨",
  ],
};

const Artes = () => {
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
      setMensagemSalvo(`Peça registrada: ${nomePeca.trim()} em ${dataPeca}.`);
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
          <PageHeader title="Artes e Talentos" emoji="🎨" />
          <GuideCharacter message="O que vamos fazer hoje? Escolha uma arte!" size="md" />

          <div className="space-y-4">
            {([
              { key: "bordado" as Arte, emoji: "🧵", label: "Bordado" },
              { key: "croche" as Arte, emoji: "🧶", label: "Crochê" },
              { key: "pintura" as Arte, emoji: "🎨", label: "Pintura" },
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

          {/* Meus talentos */}
          <div className="card-elder space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Meus talentos</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nome da peça"
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
                Salvar talento
              </ElderButton>
              {mensagemSalvo && (
                <p className="text-sm text-green-600">{mensagemSalvo}</p>
              )}
            </div>
          </div>

          {/* Motor training teaser */}
          <div className="card-elder bg-accent/30 text-center space-y-3">
            <p className="text-2xl">🖐️</p>
            <p className="text-xl font-bold text-foreground">Treino Motor</p>
            <p className="text-muted-foreground">Exercícios para preparar suas mãos para artes!</p>
            <ElderButton onClick={() => { setArteAtual("bordado"); setPasso(0); }} variant="primary">
              Começar treino
            </ElderButton>
          </div>
        </div>
        <EmergencyButton />
      </div>
    );
  }

  const passos = tutoriais[arteAtual];
  const isLast = passo >= passos.length - 1;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader
          title={arteAtual === "croche" ? "Crochê" : arteAtual === "bordado" ? "Bordado" : "Pintura"}
          emoji={arteAtual === "croche" ? "🧶" : arteAtual === "bordado" ? "🧵" : "🎨"}
        />

        <GuideCharacter message={passos[passo]} size="md" />

        <div className="card-elder text-center space-y-4">
          <p className="text-muted-foreground text-lg">
            Passo {passo + 1} de {passos.length}
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
              Ouvir instrução
            </ElderButton>

            <div className="flex gap-3">
              <ElderButton
                onClick={() => setPasso(Math.max(0, passo - 1))}
                variant="accent"
                fullWidth
              >
                ← Repetir
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
                {isLast ? "Finalizar ✨" : "Próximo →"}
              </ElderButton>
            </div>
          </div>
        </div>

        <ElderButton onClick={() => setArteAtual(null)} variant="secondary" fullWidth>
          ← Voltar para Artes
        </ElderButton>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Artes;
