import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import EmergencyButton from "@/components/EmergencyButton";
import GuideCharacter from "@/components/GuideCharacter";
import { useI18n } from "@/i18n";

type Suit = "♠" | "♥" | "♦" | "♣";
type Card = { suit: Suit; name: string; strength: number };

const suitColor: Record<Suit, string> = {
  "♠": "text-foreground",
  "♣": "text-foreground",
  "♥": "text-destructive",
  "♦": "text-destructive",
};

const baseCards = [
  { name: "4", strength: 1 },
  { name: "5", strength: 2 },
  { name: "6", strength: 3 },
  { name: "7", strength: 4 },
  { name: "Q", strength: 5 },
  { name: "J", strength: 6 },
  { name: "K", strength: 7 },
  { name: "A", strength: 8 },
  { name: "2", strength: 9 },
  { name: "3", strength: 10 },
];

function createDeck(): Card[] {
  const suits: Suit[] = ["♠", "♥", "♦", "♣"];
  const deck = suits.flatMap((suit) => baseCards.map((card) => ({ ...card, suit })));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const Truco = () => {
  const { t } = useI18n();
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [computerHand, setComputerHand] = useState<Card[]>([]);
  const [playerCard, setPlayerCard] = useState<Card | null>(null);
  const [computerCard, setComputerCard] = useState<Card | null>(null);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [computerPoints, setComputerPoints] = useState(0);
  const [message, setMessage] = useState("");

  const newRound = useCallback(() => {
    const deck = createDeck();
    setPlayerHand(deck.slice(0, 3));
    setComputerHand(deck.slice(3, 6));
    setPlayerCard(null);
    setComputerCard(null);
    setMessage(t("games.trucoStart"));
  }, [t]);

  useEffect(() => newRound(), [newRound]);

  const play = (card: Card) => {
    const computer = computerHand[Math.floor(Math.random() * computerHand.length)];
    setPlayerCard(card);
    setComputerCard(computer);
    setPlayerHand((prev) => prev.filter((item) => item !== card));
    setComputerHand((prev) => prev.filter((item) => item !== computer));
    if (card.strength > computer.strength) {
      setPlayerPoints((points) => points + 1);
      setMessage(t("games.trucoWin"));
    } else if (card.strength < computer.strength) {
      setComputerPoints((points) => points + 1);
      setMessage(t("games.trucoLose"));
    } else {
      setMessage(t("games.trucoTie"));
    }
  };

  const gameOver = playerPoints >= 12 || computerPoints >= 12;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("leisure.truco")} emoji="🃏" />
        <GuideCharacter message={message || t("games.trucoGuide")} size="sm" />
        <div className="flex justify-around">
          <div className="card-elder text-center flex-1 mx-2">
            <p className="text-lg text-muted-foreground">{t("games.you")}</p>
            <p className="text-3xl font-bold text-primary">{playerPoints}</p>
          </div>
          <div className="card-elder text-center flex-1 mx-2">
            <p className="text-lg text-muted-foreground">{t("games.computer")}</p>
            <p className="text-3xl font-bold text-destructive">{computerPoints}</p>
          </div>
        </div>
        {(playerCard || computerCard) && (
          <div className="flex justify-center gap-6">
            {[{ card: playerCard, label: t("games.you") }, { card: computerCard, label: "PC" }].map((item, index) =>
              item.card ? (
                <div key={index} className={`card-elder text-center px-6 py-4 ${suitColor[item.card.suit]}`}>
                  <p className="text-3xl font-bold">{item.card.name}</p>
                  <p className="text-2xl">{item.card.suit}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ) : null
            )}
          </div>
        )}
        {!gameOver && playerHand.length > 0 && (
          <div>
            <p className="text-lg font-bold text-foreground text-center mb-3">{t("games.yourCards")}</p>
            <div className="flex justify-center gap-4">
              {playerHand.map((card, index) => (
                <motion.button key={`${card.suit}-${card.name}-${index}`} whileTap={{ scale: 0.95 }} whileHover={{ y: -8 }} onClick={() => play(card)} className={`card-elder text-center px-6 py-4 cursor-pointer hover:border-primary ${suitColor[card.suit]}`}>
                  <p className="text-3xl font-bold">{card.name}</p>
                  <p className="text-2xl">{card.suit}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}
        {(playerHand.length === 0 || gameOver) && (
          <ElderButton onClick={() => { if (gameOver) { setPlayerPoints(0); setComputerPoints(0); } newRound(); }} variant="primary" fullWidth icon="🔄">
            {gameOver ? t("games.newGame") : t("games.nextRound")}
          </ElderButton>
        )}
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Truco;
