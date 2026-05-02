import { safeStorage } from "@/lib/storage";

export type Talent = {
  id: string;
  name: string;
  date: string;
  imageDataUrl?: string;
};

const KEY = "healthia.talents";

export const talentsService = {
  load() {
    return safeStorage.get<Talent[]>(KEY, []);
  },
  save(talent: Omit<Talent, "id">) {
    const talents = this.load();
    const next = [{ ...talent, id: crypto.randomUUID?.() ?? String(Date.now()) }, ...talents];
    safeStorage.set(KEY, next);
    return next;
  },
};
