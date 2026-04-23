import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";

const EmergencyButton = () => {
  const { t } = useTranslation();

  const handleEmergency = () => {
    toast({
      title: t("emergency.simulated"),
      description: t("emergency.info"),
      variant: "destructive",
    });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleEmergency}
      className="fixed bottom-6 right-6 z-50 bg-destructive text-destructive-foreground rounded-full p-5 shadow-lg flex items-center gap-2"
      aria-label={t("emergency.title")}
    >
      <Phone className="w-7 h-7" />
      <span className="text-lg font-bold hidden sm:inline">{t("emergency.label")}</span>
    </motion.button>
  );
};

export default EmergencyButton;
