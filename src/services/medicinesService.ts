import { safeStorage } from "@/lib/storage";

export type Medicine = {
  id: number;
  nameKey?: "bloodPressure" | "vitaminD" | "calcium";
  name?: string;
  time: string;
  taken: boolean;
};

const KEY = "healthia.medicines";

export const defaultMedicines: Medicine[] = [
  { id: 1, nameKey: "bloodPressure", time: "08:00", taken: false },
  { id: 2, nameKey: "vitaminD", time: "12:00", taken: false },
  { id: 3, nameKey: "calcium", time: "20:00", taken: false },
];

export const medicinesService = {
  load() {
    return safeStorage.get<Medicine[]>(KEY, defaultMedicines);
  },
  save(medicines: Medicine[]) {
    safeStorage.set(KEY, medicines);
  },
};
