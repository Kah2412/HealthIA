import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import EmergencyButton from "@/components/EmergencyButton";
import GuideCharacter from "@/components/GuideCharacter";

// Simplified Truco: player vs computer, play highest card wins
type Naipe = "♠" | "♥" | "♦" | "♣";
type Carta = { naipe: Naipe; valor: number; nome: string; forca: number };

const naipeColor: Record<Naipe, string> = {
  "♠": "text-foreground",
  "♣": "text-foreground",
  "♥": "text-destructive",
  "♦": "text-destructive",
};

const cartasBase: { valor: number; nome: string; forca: number }[] = [
  { valor: 4, nome: "4", forca: 1 },
  { valor: 5, nome: "5", forca: 2 },
  { valor: 6, nome: "6", forca: 3 },
  { valor: 7, nome: "7", forca: 4 },
  { valor: 12, nome: "Q", forca: 5 },
  { valor: 11, nome: "J", forca: 6 },
  { valor: 13, nome: "K", forca: 7 },
  { valor: 1, nome: "A", forca: 8 },
  { valor: 2, nome: "2", forca: 9 },
  { valor: 3, nome: "3", forca: 10 },
];

function criarBaralho(): Carta[] {
  const naipes: Naipe[] = ["♠", "♥", "♦", "♣"];
  const deck: Carta[] = [];
  for (const n of naipes) {
    for (const c of cartasBase) {
      deck.push({ naipe: n, valor: c.valor, nome: c.nome, forca: c.forca });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const Truco = () => {
  const [maoJogador, setMaoJogador] = useState<Carta[]>([]);
  const [maoPC, setMaoPC] = useState<Carta[]>([]);
  const [cartaJogador, setCartaJogador] = useState<Carta | null>(null);
  const [cartaPC, setCartaPC] = useState<Carta | null>(null);
  const [pontosJogador, setPontosJogador] = useState(0);
  const [pontosPC, setPontosPC] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [rodada, setRodada] = useState(0);

  const novaRodada = useCallback(() => {
    const deck = criarBaralho();
    setMaoJogador(deck.slice(0, 3));
    setMaoPC(deck.slice(3, 6));
    setCartaJogador(null);
    setCartaPC(null);
    setMensagem("Escolha uma carta para jogar!");
    setRodada(r => r + 1);
  }, []);

  useEffect(() => { novaRodada(); }, [novaRodada]);

  const jogar = (carta: Carta) => {
    const pcCarta = maoPC[Math.floor(Math.random() * maoPC.length)];

    setCartaJogador(carta);
    setCartaPC(pcCarta);
    setMaoJogador(prev => prev.filter(c => c !== carta));
    setMaoPC(prev => prev.filter(c => c !== pcCarta));

    if (carta.forca > pcCarta.forca) {
      setPontosJogador(p => p + 1);
      setMensagem("Você ganhou essa rodada! 🎉");
    } else if (carta.forca < pcCarta.forca) {
      setPontosPC(p => p + 1);
      setMensagem("O computador ganhou essa rodada!");
    } else {
      setMensagem("Empate nessa rodada!");
    }
  };

  const gameOver = pontosJogador >= 12 || pontosPC >= 12;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title="Truco" emoji="🃏" />

        <GuideCharacter message={mensagem || "Vamos jogar truco!"} size="sm" />

        {/* Score */}
        <div className="flex justify-around">
          <div className="card-elder text-center flex-1 mx-2">
            <p className="text-lg text-muted-foreground">Você</p>
            <p className="text-3xl font-bold text-primary">{pontosJogador}</p>
          </div>
          <div className="card-elder text-center flex-1 mx-2">
            <p className="text-lg text-muted-foreground">Computador</p>
            <p className="text-3xl font-bold text-destructive">{pontosPC}</p>
          </div>
        </div>

        {/* Played cards */}
        {(cartaJogador || cartaPC) && (
          <div className="flex justify-center gap-6">
            {cartaJogador && (
              <div className={`card-elder text-center px-6 py-4 ${naipeColor[cartaJogador.naipe]}`}>
                <p className="text-3xl font-bold">{cartaJogador.nome}</p>
                <p className="text-2xl">{cartaJogador.naipe}</p>
                <p className="text-xs text-muted-foreground mt-1">Você</p>
              </div>
            )}
            {cartaPC && (
              <div className={`card-elder text-center px-6 py-4 ${naipeColor[cartaPC.naipe]}`}>
                <p className="text-3xl font-bold">{cartaPC.nome}</p>
                <p className="text-2xl">{cartaPC.naipe}</p>
                <p className="text-xs text-muted-foreground mt-1">PC</p>
              </div>
            )}
          </div>
        )}

        {/* Player hand */}
        {!gameOver && maoJogador.length > 0 && (
          <div>
            <p className="text-lg font-bold text-foreground text-center mb-3">Suas cartas:</p>
            <div className="flex justify-center gap-4">
              {maoJogador.map((carta, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ y: -8 }}
                  onClick={() => jogar(carta)}
                  className={`card-elder text-center px-6 py-4 cursor-pointer hover:border-primary ${naipeColor[carta.naipe]}`}
                >
                  <p className="text-3xl font-bold">{carta.nome}</p>
                  <p className="text-2xl">{carta.naipe}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {(maoJogador.length === 0 || gameOver) && (
          <ElderButton onClick={() => { if (gameOver) { setPontosJogador(0); setPontosPC(0); } novaRodada(); }} variant="primary" fullWidth icon="🔄">
            {gameOver ? "Novo Jogo" : "Próxima Rodada"}
          </ElderButton>
        )}
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Truco;
