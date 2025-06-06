"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const THEME_COLORS = {
  light: "#ffffff", // hsl(0 0% 100%)
  dark: "#0a0a0a", // hsl(0 0% 3.9%)
  system: "#ffffff", // fallback to light
};

export function ThemeColorUpdater() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Determine the actual theme being used
    const currentTheme =
      theme === "system" ? systemTheme || "light" : theme || "light";
    const themeColor =
      THEME_COLORS[currentTheme as keyof typeof THEME_COLORS] ||
      THEME_COLORS.light;

    // Update theme-color meta tag
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute("content", themeColor);

    // Update apple-mobile-web-app-status-bar-style
    let statusBarMeta = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (!statusBarMeta) {
      statusBarMeta = document.createElement("meta");
      statusBarMeta.setAttribute(
        "name",
        "apple-mobile-web-app-status-bar-style"
      );
      document.head.appendChild(statusBarMeta);
    }

    // Use "default" for light theme (black text) and "black-translucent" for dark theme (white text)
    const statusBarStyle =
      currentTheme === "light" ? "default" : "black-translucent";
    statusBarMeta.setAttribute("content", statusBarStyle);

    // Also update the manifest theme color dynamically
    let manifestLink = document.querySelector(
      'link[rel="manifest"]'
    ) as HTMLLinkElement;
    if (manifestLink) {
      // Note: This won't actually update the cached manifest, but helps with initial loads
      document.documentElement.style.setProperty(
        "--pwa-theme-color",
        themeColor
      );
    }
  }, [theme, systemTheme]);

  return null;
}
