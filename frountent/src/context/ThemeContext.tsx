import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';
type ThemeColor = 'blue' | 'purple' | 'red';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  toggleMode: () => void;
  setColor: (color: ThemeColor) => void;
  getThemeColors: () => ThemeColors;
}

interface ThemeColors {
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  input: string;
  inputBorder: string;
  cardBg: string;
  headerBg: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorPalettes = {
  blue: {
    primary: '#0b7de0',
    primaryHover: '#1a8cf0',
    primaryLight: 'rgba(11,125,224,0.1)',
  },
  purple: {
    primary: '#8b5cf6',
    primaryHover: '#a78bfa',
    primaryLight: 'rgba(139,92,246,0.1)',
  },
  red: {
    primary: '#ef4444',
    primaryHover: '#f87171',
    primaryLight: 'rgba(239,68,68,0.1)',
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'dark';
  });

  const [color, setColorState] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem('theme-color');
    return (saved as ThemeColor) || 'blue';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('theme-color', color);
  }, [color]);

  const toggleMode = () => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
  };

  const getThemeColors = (): ThemeColors => {
    const palette = colorPalettes[color];
    
    if (mode === 'dark') {
      return {
        background: '#1a1a1a',
        surface: '#242424',
        surfaceHover: '#2c2c2c',
        text: '#ffffff',
        textSecondary: '#b3b3b3',
        border: 'rgba(255,255,255,0.05)',
        input: '#1a1a1a',
        inputBorder: 'rgba(255,255,255,0.1)',
        cardBg: 'rgba(255,255,255,0.02)',
        headerBg: '#242424',
        ...palette,
      };
    } else {
      return {
        background: '#f8fafc',
        surface: '#ffffff',
        surfaceHover: '#f1f5f9',
        text: '#0f172a',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        input: '#ffffff',
        inputBorder: '#cbd5e1',
        cardBg: '#ffffff',
        headerBg: '#ffffff',
        ...palette,
      };
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, color, toggleMode, setColor, getThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
