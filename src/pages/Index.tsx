import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import GuideCharacter from "@/components/GuideCharacter";
import ElderButton from "@/components/ElderButton";
import EmergencyButton from "@/components/EmergencyButton";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia! ☀️";
  if (h < 18) return "Boa tarde! 🌤️";
  return "Boa noite! 🌙";
};

const getWeatherCondition = (weathercode: number) => {
  if (weathercode === 0) return "Ensolarado";
  if (weathercode >= 1 && weathercode <= 3) return "Parcialmente nublado";
  return "Chuvoso";
};

const getRecommendation = (temperature: number) => {
  if (temperature >= 24) return "Dia quente, beba água 💧";
  if (temperature <= 16) return "Leve casaco 🧥";
  return "Clima ameno, aproveite com calma.";
};

const menuItems = [
  { label: "Remédios", icon: "💊", path: "/remedios", variant: "primary" as const },
  { label: "Água", icon: "💧", path: "/agua", variant: "secondary" as const },
  { label: "Avisos", icon: "📢", path: "/avisos", variant: "accent" as const },
  { label: "Lazer", icon: "🎲", path: "/lazer", variant: "primary" as const },
  { label: "Artes e Talentos", icon: "🎨", path: "/artes", variant: "accent" as const },
  { label: "Livros", icon: "📚", path: "/livros", variant: "secondary" as const },
  { label: "Alfabetização", icon: "🔤", path: "/alfabetizacao", variant: "primary" as const },
];

const Index = () => {
  const navigate = useNavigate();
  const { highContrast, toggleHighContrast } = useAccessibility();
  const [weather, setWeather] = useState<{ temperature: number; weathercode: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
        );
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Erro ao buscar clima:", error);
      } finally {
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude);
          },
          (error) => {
            console.warn("Geolocalização falhou, usando fallback:", error);
            fetchWeather(-18.97, -49.46); // Fallback
          }
        );
      } else {
        console.warn("Geolocalização não suportada, usando fallback");
        fetchWeather(-18.97, -49.46); // Fallback
      }
    };

    getLocation();
  }, []);

  const getWeatherMessage = () => {
    if (loading) return "Carregando clima...";
    if (!weather) return "Não foi possível obter o clima.";
    const condition = getWeatherCondition(weather.weathercode);
    const recommendation = getRecommendation(weather.temperature);
    return `Hoje está ${condition}, ${weather.temperature}°C. ${recommendation}`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Accessibility toggle */}
        <div className="flex justify-end">
          <button
            onClick={toggleHighContrast}
            className={`btn-elder px-5 py-3 text-base ${highContrast ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
            aria-label="Modo alto contraste"
          >
            <Eye className="w-5 h-5 inline mr-2" />
            {highContrast ? "Normal" : "Alto Contraste"}
          </button>
        </div>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">{getGreeting()}</h1>
        </motion.div>

        {/* Guide character */}
        <GuideCharacter message={getWeatherMessage()} size="md" />

        {/* Quick tips */}
        <div className="card-elder bg-secondary/50 border-secondary">
          <p className="text-lg font-semibold text-secondary-foreground">
            💧 Lembre-se de beber água! &nbsp; 💊 Verifique seus remédios.
          </p>
        </div>

        {/* Menu buttons */}
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <ElderButton
                onClick={() => navigate(item.path)}
                variant={item.variant}
                icon={item.icon}
                fullWidth
              >
                {item.label}
              </ElderButton>
            </motion.div>
          ))}
        </div>
      </div>

      <EmergencyButton />
    </div>
  );
};

export default Index;
