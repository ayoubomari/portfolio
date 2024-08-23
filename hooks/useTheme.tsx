"use client";
import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.add(storedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.add(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme };
}
