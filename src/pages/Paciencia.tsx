import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import EmergencyButton from "@/components/EmergencyButton";
import GuideCharacter from "@/components/GuideCharacter";
import { useI18n } from "@/i18n";

type Suit = "♠" | "♥" | "♦" | "♣";
type CardType = { suit: Suit; value: number; id: string };

const suitColors: Record<Suit, string> = {
  "♠": "text-foreground",
  "♣": "text-foreground",
  "♥": "text-destructive",
  "♦": "text-destructive",
};

const valueNames: Record<number, string> = { 1: "A", 11: "J", 12: "Q", 13: "K" };
const getValueDisplay = (value: number) => valueNames[value] || String(value);

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createDeck(): CardType[] {
  const suits: Suit[] = ["♠", "♥", "♦", "♣"];
  return shuffle(suits.flatMap((suit) => Array.from({ length: 13 }, (_, index) => ({ suit, value: index + 1, id: `${suit}${index + 1}` }))));
}

const Paciencia = () => {
  const { t } = useI18n();
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);

  const initGame = useCallback(() => {
    const deck = createDeck().slice(0, 8);
    setCards(shuffle([...deck, ...deck.map((card) => ({ ...card, id: `${card.id}b` }))]));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  }, []);

  useEffect(() => initGame(), [initGame]);

  const handleFlip = (index: number) => {
    if (flipped.length >= 2 || flipped.includes(index)) return;
    const matchKey = cards[index].suit + cards[index].value;
    if (matched.has(matchKey)) return;
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((value) => value + 1);
      const [a, b] = next;
      if (cards[a].suit === cards[b].suit && cards[a].value === cards[b].value) {
        setMatched((prev) => new Set([...prev, matchKey]));
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
        <PageHeader title={t("leisure.solitaire")} emoji="♠️" />
        <GuideCharacter message={isWon ? t("games.solitaireWin") : t("games.solitaireGuide")} size="sm" />
        <p className="text-xl font-bold text-foreground text-center">{t("games.moves")}: {moves} | {t("games.pairs")}: {matched.size}/8</p>
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index);
            const isMatched = matched.has(card.suit + card.value);
            return (
              <motion.button
                key={card.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFlip(index)}
                className={`aspect-[3/4] rounded-xl text-2xl font-bold flex flex-col items-center justify-center border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  isMatched ? "bg-success/20 border-success opacity-70" : isFlipped ? `bg-card border-primary ${suitColors[card.suit]}` : "bg-primary border-primary/50 text-primary-foreground"
                }`}
                disabled={isMatched}
              >
                {isFlipped || isMatched ? (
                  <>
                    <span className="text-lg leading-none">{getValueDisplay(card.value)}</span>
                    <span className="text-xl leading-none">{card.suit}</span>
                  </>
                ) : (
                  <span className="text-3xl">🂠</span>
                )}
              </motion.button>
            );
          })}
        </div>
        <ElderButton onClick={initGame} variant="primary" fullWidth icon="🔄">{t("games.newGame")}</ElderButton>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Paciencia;
