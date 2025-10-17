// contexts/ThemeProvider.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Theme, ThemeContextType } from "../types/contexts";

export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = window.localStorage.getItem("theme") as Theme;
      return savedTheme || "light";
    } catch (error) {
      console.error("error", error);
      return "light";
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const oldTheme = theme === "light" ? "dark" : "light";
    root.classList.remove(oldTheme);
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5. Tạo Custom Hook để sử dụng dễ dàng và an toàn
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
