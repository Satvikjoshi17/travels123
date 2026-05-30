"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="material-symbols-outlined text-primary dark:text-white cursor-pointer w-6 h-6">dark_mode</span>;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <span 
      className="material-symbols-outlined text-primary dark:text-white cursor-pointer hover:scale-110 transition-transform" 
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? "light_mode" : "dark_mode"}
    </span>
  );
}
