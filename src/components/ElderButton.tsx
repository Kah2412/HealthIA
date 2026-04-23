import { motion } from "framer-motion";

interface ElderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "success" | "destructive";
  icon?: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

const ElderButton = ({
  children,
  onClick,
  variant = "primary",
  icon,
  className = "",
  fullWidth = false,
  disabled = false,
}: ElderButtonProps) => {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`btn-elder ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} flex items-center justify-center gap-3 ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};

export default ElderButton;
