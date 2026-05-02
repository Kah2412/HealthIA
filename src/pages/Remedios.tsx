import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import ElderButton from "@/components/ElderButton";
import GuideCharacter from "@/components/GuideCharacter";
import EmergencyButton from "@/components/EmergencyButton";
import { useToast } from "@/hooks/use-toast";
import { medicinesService, Medicine } from "@/services/medicinesService";
import { useI18n } from "@/i18n";

const Remedios = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>(() => medicinesService.load());
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState("");

  const save = (next: Medicine[]) => {
    setMedicines(next);
    medicinesService.save(next);
  };

  const medicineName = (medicine: Medicine) => (medicine.nameKey ? t(`medicines.${medicine.nameKey}`) : medicine.name ?? "");

  const markTaken = (id: number) => {
    save(medicines.map((item) => (item.id === id ? { ...item, taken: true } : item)));
  };

  const addMedicine = () => {
    if (!newName.trim()) {
      toast({ title: t("medicines.nameRequired"), variant: "destructive" });
      return;
    }
    if (!newTime) {
      toast({ title: t("medicines.timeRequired"), variant: "destructive" });
      return;
    }
    const next = [
      ...medicines,
      { id: Math.max(0, ...medicines.map((item) => item.id)) + 1, name: newName.trim(), time: newTime, taken: false },
    ];
    save(next);
    setNewName("");
    setNewTime("");
    toast({ title: t("medicines.success") });
  };

  const allDone = medicines.length > 0 && medicines.every((item) => item.taken);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 space-y-6">
        <PageHeader title={t("medicines.title")} emoji="💊" />

        <GuideCharacter message={allDone ? t("medicines.allDone") : t("medicines.reminder")} size="sm" />

        <div className="card-elder space-y-4">
          <h3 className="text-lg font-semibold text-foreground">{t("medicines.addNew")}</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder={t("medicines.name")}
              aria-label={t("medicines.name")}
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground text-lg"
            />
            <input
              type="time"
              aria-label={t("medicines.time")}
              value={newTime}
              onChange={(event) => setNewTime(event.target.value)}
              className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground text-lg"
            />
            <ElderButton onClick={addMedicine} variant="primary" fullWidth>
              {t("medicines.add")}
            </ElderButton>
          </div>
        </div>

        <div className="space-y-4">
          {medicines.map((medicine) => (
            <motion.div key={medicine.id} layout className={`card-elder flex items-center justify-between gap-4 ${medicine.taken ? "opacity-70" : ""}`}>
              <div className="min-w-0">
                <p className="text-xl font-bold text-foreground break-words">{medicineName(medicine)}</p>
                <p className="text-lg text-muted-foreground">⏰ {medicine.time}</p>
              </div>
              {medicine.taken ? (
                <span className="text-2xl" aria-label={t("medicines.taken")}>✅</span>
              ) : (
                <ElderButton onClick={() => markTaken(medicine.id)} variant="success">
                  {t("medicines.taken")}
                </ElderButton>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <EmergencyButton />
    </div>
  );
};

export default Remedios;
