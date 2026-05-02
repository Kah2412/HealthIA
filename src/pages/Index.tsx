import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import GuideCharacter from "@/components/GuideCharacter";
import ElderButton from "@/components/ElderButton";
import EmergencyButton from "@/components/EmergencyButton";
import LanguageSelector from "@/components/LanguageSelector";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useI18n } from "@/i18n";

const menuItems = [
  { key: "home.medications", icon: "💊", path: "/remedios", variant: "primary" as const },
  { key: "home.water", icon: "💧", path: "/agua", variant: "secondary" as const },
  { key: "home.alerts", icon: "📢", path: "/avisos", variant: "accent" as const },
  { key: "home.leisure", icon: "🎲", path: "/lazer", variant: "primary" as const },
  { key: "home.arts", icon: "🎨", path: "/artes", variant: "accent" as const },
  { key: "home.books", icon: "📚", path: "/livros", variant: "secondary" as const },
  { key: "home.literacy", icon: "🔤", path: "/alfabetizacao", variant: "primary" as const },
];

const Index = () => {
  const navigate = useNavigate();
  const { highContrast, toggleHighContrast } = useAccessibility();
  const { t } = useI18n();
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
        console.error("Weather error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
        () => fetchWeather(-18.97, -49.46)
      );
    } else {
      fetchWeather(-18.97, -49.46);
    }
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.morning");
    if (hour < 18) return t("home.afternoon");
    return t("home.goodEvening");
  };

  const condition = (code: number) => {
    if (code === 0) return t("home.sunny");
    if (code >= 1 && code <= 3) return t("home.partlyCloudy");
    return t("home.rainy");
  };

  const recommendation = (temperature: number) => {
    if (temperature >= 24) return t("home.warmDrinkWater");
    if (temperature <= 16) return t("home.coldCoat");
    return t("home.mildWeather");
  };

  const weatherMessage = () => {
    if (loading) return t("home.weatherLoading");
    if (!weather) return t("home.weatherUnavailable");
    return `${t("home.weather", { condition: condition(weather.weathercode), temperature: weather.temperature })} ${recommendation(weather.temperature)}`;
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap justify-end gap-2">
          <LanguageSelector />
          <button
            onClick={toggleHighContrast}
            className={`btn-elder px-5 py-3 text-base ${highContrast ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
            aria-label={t("common.highContrast")}
          >
            <Eye className="w-5 h-5 inline mr-2" />
            {highContrast ? t("common.normal") : t("common.highContrast")}
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground">{greeting()}</h1>
        </motion.div>

        <GuideCharacter message={weatherMessage()} size="md" />

        <div className="card-elder bg-secondary/50 border-secondary">
          <p className="text-lg font-semibold text-secondary-foreground">
            💧 {t("home.drinkReminder")} &nbsp; 💊 {t("home.checkMedicines")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, i) => (
            <motion.div key={item.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <ElderButton onClick={() => navigate(item.path)} variant={item.variant} icon={item.icon} fullWidth>
                {t(item.key)}
              </ElderButton>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">{t("common.medicalDisclaimer")}</p>
      </div>

      <EmergencyButton />
    </div>
  );
};

export default Index;
