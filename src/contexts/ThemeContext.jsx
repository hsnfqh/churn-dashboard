import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const lightTheme = {
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
    cardBg: "rgba(255,255,255,0.8)",
    cardBorder: "rgba(0,0,0,0.08)",
    text: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    sidebarBg: "rgba(255,255,255,0.95)",
    sidebarBorder: "rgba(0,0,0,0.06)",
    inputBg: "rgba(0,0,0,0.03)",
    inputBorder: "rgba(0,0,0,0.1)",
    tableRowEven: "transparent",
    tableRowOdd: "rgba(0,0,0,0.02)",
    chartGrid: "rgba(0,0,0,0.05)",
    chartAxis: "rgba(0,0,0,0.3)",
    buttonPrimary: "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)",
    badgeBg: "rgba(0,0,0,0.05)",
    tooltipBg: "rgba(255,255,255,0.95)",
    tooltipBorder: "rgba(0,0,0,0.1)",
  };

  const darkTheme = {
    background: "linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)",
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    text: "#ffffff",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.4)",
    sidebarBg: "rgba(13,31,60,0.95)",
    sidebarBorder: "rgba(255,255,255,0.06)",
    inputBg: "rgba(255,255,255,0.05)",
    inputBorder: "rgba(255,255,255,0.1)",
    tableRowEven: "transparent",
    tableRowOdd: "rgba(255,255,255,0.02)",
    chartGrid: "rgba(255,255,255,0.05)",
    chartAxis: "rgba(255,255,255,0.3)",
    buttonPrimary: "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)",
    badgeBg: "rgba(255,255,255,0.08)",
    tooltipBg: "rgba(13,31,60,0.95)",
    tooltipBorder: "rgba(255,255,255,0.1)",
  };

  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors }}>
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