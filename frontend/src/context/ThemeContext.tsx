import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

// Theme types
export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;                 // user preference (light | dark | system)
  resolvedTheme: "light" | "dark"; // actual applied theme after resolving system
  setTheme: (t: Theme) => void;
  toggle: () => void;           // quick toggle between light/dark
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme";

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(pref: Theme): "light" | "dark" {
  if (pref === "system") return getSystemPrefersDark() ? "dark" : "light";
  return pref;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return stored ?? "system";
    } catch {
      return "system";
    }
  });

  const mqRef = useRef<MediaQueryList | null>(null);

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);

  // Apply/remove the `dark` class on <html>
  useEffect(() => {
    const root = document.documentElement;
    const isDark = resolvedTheme === "dark";
    root.classList.toggle("dark", isDark);
  }, [resolvedTheme]);

  // Persist preference and listen to system changes when in `system`
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}

    if (theme === "system") {
      if (!mqRef.current) {
        mqRef.current = window.matchMedia("(prefers-color-scheme: dark)");
      }
      const mq = mqRef.current;
      const handler = () => {
        const root = document.documentElement;
        root.classList.toggle("dark", mq.matches);
      };
      mq.addEventListener?.("change", handler);
      // In case it changed between renders
      handler();
      return () => mq.removeEventListener?.("change", handler);
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggle = () => setThemeState(prev => (resolveTheme(prev) === "dark" ? "light" : "dark"));

  const value: ThemeContextValue = { theme, resolvedTheme, setTheme, toggle };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
