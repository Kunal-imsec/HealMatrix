import React, { createContext, useContext, useState, useEffect } from "react";
import settingsService from "../services/settingsService"; // ✅ make sure this exists

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children, user }) => {
  const [theme, setTheme] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("indigo");

  // ✅ New states
  const [colorScheme, setColorScheme] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // ✅ Color schemes
  const colorSchemes = {
    blue: {
      primary: "#3B82F6",
      secondary: "#1E40AF",
      accent: "#60A5FA"
    },
    green: {
      primary: "#10B981",
      secondary: "#059669",
      accent: "#34D399"
    },
    purple: {
      primary: "#8B5CF6",
      secondary: "#7C3AED",
      accent: "#A78BFA"
    },
    red: {
      primary: "#EF4444",
      secondary: "#DC2626",
      accent: "#F87171"
    }
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("hospital_theme");
    const savedPrimaryColor = localStorage.getItem("hospital_primary_color");
    const savedColorScheme = localStorage.getItem("hospital_color_scheme");
    const savedFontSize = localStorage.getItem("hospital_font_size");
    const savedHighContrast = localStorage.getItem("hospital_high_contrast") === "true";
    const savedReducedMotion = localStorage.getItem("hospital_reduced_motion") === "true";

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    if (savedPrimaryColor) setPrimaryColor(savedPrimaryColor);
    if (savedColorScheme) setColorScheme(savedColorScheme);
    if (savedFontSize) setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
  }, []);

  // Apply theme and color updates to document
  useEffect(() => {
    const root = document.documentElement;

    // Handle light/dark mode
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    // Apply Tailwind color map
    const colorMap = {
      indigo: {
        50: "#eef2ff",
        100: "#e0e7ff",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
        800: "#3730a3",
        900: "#312e81"
      },
      blue: {
        50: "#eff6ff",
        100: "#dbeafe",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a"
      },
      green: {
        50: "#f0fdf4",
        100: "#dcfce7",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d"
      },
      purple: {
        50: "#faf5ff",
        100: "#f3e8ff",
        500: "#a855f7",
        600: "#9333ea",
        700: "#7c3aed",
        800: "#6b21a8",
        900: "#581c87"
      }
    };

    const colors = colorMap[primaryColor] || colorMap.indigo;
    Object.entries(colors).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, color);
    });

    // Apply color scheme
    const scheme = colorSchemes[colorScheme];
    root.style.setProperty("--color-primary", scheme.primary);
    root.style.setProperty("--color-secondary", scheme.secondary);
    root.style.setProperty("--color-accent", scheme.accent);

    // Apply font size
    root.style.fontSize = getFontSizeValue(fontSize);

    // Accessibility
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("reduced-motion", reducedMotion);

    // Save preferences
    localStorage.setItem("hospital_theme", theme);
    localStorage.setItem("hospital_primary_color", primaryColor);
    localStorage.setItem("hospital_color_scheme", colorScheme);
    localStorage.setItem("hospital_font_size", fontSize);
    localStorage.setItem("hospital_high_contrast", highContrast);
    localStorage.setItem("hospital_reduced_motion", reducedMotion);
  }, [theme, primaryColor, colorScheme, fontSize, highContrast, reducedMotion]);

  // Helpers
  const getFontSizeValue = (size) => {
    const sizes = { small: "14px", medium: "16px", large: "18px" };
    return sizes[size] || sizes.medium;
  };

  // Update theme dynamically
  const updateThemeSettings = (settings) => {
    if (settings.colorScheme) {
      setColorScheme(settings.colorScheme);
      document.documentElement.style.setProperty(
        "--color-primary",
        colorSchemes[settings.colorScheme].primary
      );
    }
    if (settings.fontSize) {
      setFontSize(settings.fontSize);
      document.documentElement.style.fontSize = getFontSizeValue(settings.fontSize);
    }
    if (settings.highContrast !== undefined) {
      setHighContrast(settings.highContrast);
      document.documentElement.classList.toggle("high-contrast", settings.highContrast);
    }
    if (settings.reducedMotion !== undefined) {
      setReducedMotion(settings.reducedMotion);
      document.documentElement.classList.toggle("reduced-motion", settings.reducedMotion);
    }
  };

  // Save preferences to backend
  const saveThemePreferences = async () => {
    try {
      if (!user) return;
      await settingsService.updateUserSettings(user.id, {
        theme,
        colorScheme,
        fontSize,
        highContrast,
        reducedMotion
      });
    } catch (error) {
      console.error("Error saving theme preferences:", error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");
  const changePrimaryColor = (color) => setPrimaryColor(color);

  // Theme summary
  const getThemeConfig = () => ({
    isDark: theme === "dark",
    isLight: theme === "light",
    primaryColor,
    colors: {
      primary: `var(--color-primary-600)`,
      primaryLight: `var(--color-primary-100)`,
      primaryDark: `var(--color-primary-800)`
    }
  });

  // ✅ Combined value
  const value = {
    theme,
    primaryColor,
    colorScheme,
    fontSize,
    highContrast,
    reducedMotion,
    colorSchemes,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    changePrimaryColor,
    updateThemeSettings,
    saveThemePreferences,
    getThemeConfig,
    isDark: theme === "dark",
    isLight: theme === "light"
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
