"use client";
import { createContext, ReactNode, useContext } from "react";
import { useTheme } from "@/hooks/useTheme";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
