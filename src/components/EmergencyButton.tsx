import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const EmergencyButton = () => {
  const handleEmergency = () => {
    toast({
      title: "🚨 Emergência simulada",
      description: "Em um app real, isso ligaria para o serviço de emergência.",
      variant: "destructive",
    });
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleEmergency}
      className="fixed bottom-6 right-6 z-50 bg-destructive text-destructive-foreground rounded-full p-5 shadow-lg flex items-center gap-2"
      aria-label="Botão de emergência"
    >
      <Phone className="w-7 h-7" />
      <span className="text-lg font-bold hidden sm:inline">SOS</span>
    </motion.button>
  );
};

export default EmergencyButton;
