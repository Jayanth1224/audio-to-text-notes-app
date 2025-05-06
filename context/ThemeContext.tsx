import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType>({ isDarkMode: true });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // For this app, we're forcing dark mode to match iOS Notes in dark mode
  const isDarkMode = true;
  
  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}