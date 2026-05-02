import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n";

const EmergencyButton = () => {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const confirmEmergency = () => {
    setOpen(false);
    toast({
      title: t("sos.simulatedTitle"),
      description: t("sos.simulatedDescription"),
      variant: "destructive",
    });
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-destructive text-destructive-foreground rounded-full p-5 shadow-lg flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-ring"
        aria-label={t("sos.aria")}
      >
        <Phone className="w-7 h-7" />
        <span className="text-lg font-bold hidden sm:inline">{t("sos.title")}</span>
      </motion.button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="sos-title">
          <div className="card-elder w-full max-w-sm space-y-5 bg-card">
            <div className="flex items-center justify-between gap-3">
              <h2 id="sos-title" className="text-2xl font-bold text-foreground">
                {t("sos.confirm")}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-muted p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={t("sos.cancel")}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-xl font-semibold text-foreground">{t("sos.question")}</p>
            <div className="rounded-2xl border border-border bg-muted p-4 text-base text-muted-foreground">
              <p className="font-bold text-foreground">{t("sos.emergencyContact")}</p>
              <p>{t("sos.importantInfo")}</p>
            </div>
            <div className="grid gap-3">
              <button type="button" onClick={confirmEmergency} className="btn-elder bg-destructive text-destructive-foreground">
                {t("sos.callNow")}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn-elder bg-muted text-foreground">
                {t("sos.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyButton;
