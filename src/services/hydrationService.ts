import { safeStorage } from "@/lib/storage";

const KEY = "healthia.hydration";
export const DAILY_WATER_GOAL = 8;

type HydrationState = {
  date: string;
  cups: number;
  history: number[];
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const emptyState = (): HydrationState => ({ date: todayKey(), cups: 0, history: [] });

export const hydrationService = {
  load(): HydrationState {
    const saved = safeStorage.get<HydrationState>(KEY, emptyState());
    if (saved.date !== todayKey()) {
      const next = emptyState();
      safeStorage.set(KEY, next);
      return next;
    }
    return { date: saved.date, cups: Math.min(DAILY_WATER_GOAL, saved.cups || 0), history: saved.history ?? [] };
  },
  add(amount: 0.5 | 1): HydrationState {
    const current = this.load();
    const allowed = Math.min(amount, DAILY_WATER_GOAL - current.cups);
    if (allowed <= 0) return current;
    const next = {
      ...current,
      cups: Number((current.cups + allowed).toFixed(1)),
      history: [...current.history, allowed],
    };
    safeStorage.set(KEY, next);
    return next;
  },
  undo(): HydrationState {
    const current = this.load();
    const history = [...current.history];
    const last = history.pop() ?? 0;
    const next = { ...current, cups: Math.max(0, Number((current.cups - last).toFixed(1))), history };
    safeStorage.set(KEY, next);
    return next;
  },
};
