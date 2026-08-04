"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import useTheme from "@/hooks/useTheme";

const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl border transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20
        bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200
        dark:bg-[#141414] dark:border-white/10 dark:text-gray-300 dark:hover:bg-[#1f1f1f] ${className}`}
    >
      {!mounted ? null : isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggle;
