import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from './colors';

const ThemeContext = createContext(darkColors);

export function ThemeProvider({ children }) {
  const scheme = useColorScheme(); // 'light' | 'dark' | null
  const colors = scheme === 'light' ? lightColors : darkColors;

  return <ThemeContext.Provider value={colors}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}