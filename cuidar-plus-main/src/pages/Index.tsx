import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import GuideCharacter from "@/components/GuideCharacter";
import ElderButton from "@/components/ElderButton";
import EmergencyButton from "@/components/EmergencyButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const META = 8;

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { highContrast, toggleHighContrast } = useAccessibility();
  const [weather, setWeather] = useState<{ temperature: number; weathercode: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("index.greeting.morning");
    if (h < 18) return t("index.greeting.afternoon");
    return t("index.greeting.evening");
  };

  const getWeatherCondition = (weathercode: number) => {
    if (weathercode === 0) return t("index.weather.sunny");
    if (weathercode >= 1 && weathercode <= 3) return t("index.weather.partlyCloudy");
    return t("index.weather.rainy");
  };

  const getRecommendation = (temperature: number) => {
    if (temperature >= 24) return t("index.weather.hotRecommendation");
    if (temperature <= 16) return t("index.weather.coldRecommendation");
    return t("index.weather.mildRecommendation");
  };

  const menuItems = [
    { label: t("index.menu.remedios"), icon: "💊", path: "/remedios", variant: "primary" as const },
    { label: t("index.menu.agua"), icon: "💧", path: "/agua", variant: "secondary" as const },
    { label: t("index.menu.avisos"), icon: "📢", path: "/avisos", variant: "accent" as const },
    { label: t("index.menu.lazer"), icon: "🎲", path: "/lazer", variant: "primary" as const },
    { label: t("index.menu.artes"), icon: "🎨", path: "/artes", variant: "accent" as const },
    { label: t("index.menu.livros"), icon: "📚", path: "/livros", variant: "secondary" as const },
    { label: t("index.menu.alfabetizacao"), icon: "🔤", path: "/alfabetizacao", variant: "primary" as const },
  ];

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
        );
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Error fetching weather:", error);
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
            console.warn("Geolocation failed, using fallback:", error);
            fetchWeather(-18.97, -49.46);
          }
        );
      } else {
        console.warn("Geolocation not supported, using fallback");
        fetchWeather(-18.97, -49.46);
      }
    };

    getLocation();
  }, []);

  const getWeatherMessage = () => {
    if (loading) return t("index.weather.loading");
    if (!weather) return t("index.weather.error");
    const condition = getWeatherCondition(weather.weathercode);
    const recommendation = getRecommendation(weather.temperature);
    return t("index.weather.message", {
      condition,
      temperature: weather.temperature,
      recommendation,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-xl mx-auto px-4 py-6 space-y-6">
        {/* Language and Accessibility toggles */}
        <div className="flex justify-between items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={toggleHighContrast}
            className={`btn-elder px-5 py-3 text-base ${highContrast ? "bg-foreground text-background" : "bg-muted text-foreground"}`}
            aria-label={t("common.toggleContrast")}
          >
            <Eye className="w-5 h-5 inline mr-2" />
            {highContrast ? t("common.normal") : t("common.highContrast")}
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
            {t("index.reminder")}
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
