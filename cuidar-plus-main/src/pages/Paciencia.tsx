import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import EmergencyButton from "@/components/EmergencyButton";
import GuideCharacter from "@/components/GuideCharacter";

type Suit = "♠" | "♥" | "♦" | "♣";
type CardType = { suit: Suit; value: number; faceUp: boolean; id: string };

const suitColors: Record<Suit, string> = {
  "♠": "text-foreground",
  "♣": "text-foreground",
  "♥": "text-destructive",
  "♦": "text-destructive",
};

const valueNames: Record<number, string> = {
  1: "A", 11: "J", 12: "Q", 13: "K",
};

const getValueDisplay = (v: number) => valueNames[v] || String(v);

function createDeck(): CardType[] {
  const suits: Suit[] = ["♠", "♥", "♦", "♣"];
  const cards: CardType[] = [];
  for (const suit of suits) {
    for (let v = 1; v <= 13; v++) {
      cards.push({ suit, value: v, faceUp: false, id: `${suit}${v}` });
    }
  }
  return shuffle(cards);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Simple matching game: find pairs by memory
const Paciencia = () => {
  const { t } = useTranslation();
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);

  const initGame = useCallback(() => {
    // Use 8 pairs (16 cards) for simplicity
    const deck = createDeck().slice(0, 8);
    const pairs = [...deck, ...deck.map(c => ({ ...c, id: c.id + "b" }))];
    setCards(shuffle(pairs));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleFlip = (index: number) => {
    if (flipped.length >= 2) return;
    if (flipped.includes(index)) return;
    if (matched.has(cards[index].suit + cards[index].value)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].suit === cards[b].suit && cards[a].value === cards[b].value) {
        setMatched(prev => new Set([...prev, cards[a].suit + cards[a].value]));
        setTimeout(() => setFlipped([]), 500);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const isWon = matched.size === 8;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("paciencia.title")} emoji="♠️" />

        <GuideCharacter
          message={isWon ? t("paciencia.complete") : t("paciencia.description")}
          size="sm"
        />

        <div className="text-center">
          <p className="text-xl font-bold text-foreground">
            {t("paciencia.progress", { moves, matched: matched.size })}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i);
            const isMatched = matched.has(card.suit + card.value);

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFlip(i)}
                className={`aspect-[3/4] rounded-xl text-2xl font-bold flex flex-col items-center justify-center border-2 transition-all ${
                  isMatched
                    ? "bg-success/20 border-success opacity-60"
                    : isFlipped
                    ? `bg-card border-primary ${suitColors[card.suit]}`
                    : "bg-primary border-primary/50 text-primary-foreground"
                }`}
                disabled={isMatched}
              >
                {isFlipped || isMatched ? (
                  <>
                    <span className="text-lg leading-none">{getValueDisplay(card.value)}</span>
                    <span className="text-xl leading-none">{card.suit}</span>
                  </>
                ) : (
                  <span className="text-3xl">{t("paciencia.card")}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        <ElderButton onClick={initGame} variant="primary" fullWidth icon="🔄">
          {t("paciencia.newGame")}
        </ElderButton>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Paciencia;
