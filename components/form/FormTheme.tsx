"use client";

import { createContext, useContext } from "react";

export type FormTheme = "light" | "dark";

const FormThemeContext = createContext<FormTheme>("light");

export function FormThemeProvider({
  theme,
  children,
}: {
  theme: FormTheme;
  children: React.ReactNode;
}) {
  return (
    <FormThemeContext.Provider value={theme}>{children}</FormThemeContext.Provider>
  );
}

export function useFormTheme() {
  return useContext(FormThemeContext);
}
