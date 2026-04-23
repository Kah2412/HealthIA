import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import guideImg from "@/assets/guide-character.png";

interface GuideCharacterProps {
  message: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { img: 60, text: "text-base" },
  md: { img: 90, text: "text-lg" },
  lg: { img: 120, text: "text-xl" },
};

const GuideCharacter = ({ message, size = "md" }: GuideCharacterProps) => {
  const { t } = useTranslation();
  const s = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-4"
    >
      <img
        src={guideImg}
        alt={t("guide.name")}
        width={s.img}
        height={s.img}
        className="rounded-full border-2 border-primary/20 object-cover object-top aspect-square flex-shrink-0"
      />
      <div className="card-elder flex-1">
        <p className={`${s.text} font-semibold text-foreground`}>{message}</p>
      </div>
    </motion.div>
  );
};

export default GuideCharacter;
