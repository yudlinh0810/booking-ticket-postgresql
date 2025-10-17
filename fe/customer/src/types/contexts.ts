import { Dispatch, SetStateAction } from "react";

export type Theme = "light" | "dark";

export type ThemeContextType = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: () => void;
};
