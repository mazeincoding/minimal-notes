import { create } from "zustand";

type Screen = "home" | "notes" | "editor" | "account" | "signin" | "theme";

// Screen display configuration
const SCREEN_CONFIG: Record<Screen, { displayName: string }> = {
  home: { displayName: "Home" },
  notes: { displayName: "Notes" },
  editor: { displayName: "Editor" },
  account: { displayName: "Account" },
  signin: { displayName: "Sign in" },
  theme: { displayName: "Theme" },
};

interface ScreenStore {
  screen: Screen;
  navigationStack: Screen[];
  setScreen: (screen: Screen) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  getPreviousScreen: () => Screen | null;
  getScreenDisplayName: (screen: Screen) => string;
  getPreviousScreenDisplayName: () => string;
}

export const useScreenStore = create<ScreenStore>((set, get) => ({
  screen: "notes",
  navigationStack: ["home", "notes"],

  setScreen: (screen) => {
    const { navigationStack, screen: currentScreen } = get();

    // Don't add duplicate consecutive screens
    if (currentScreen === screen) return;

    set({
      screen,
      navigationStack: [...navigationStack, screen],
    });
  },

  goBack: () => {
    const { navigationStack } = get();

    if (navigationStack.length <= 1) return;

    // Remove current screen and go to previous
    const newStack = navigationStack.slice(0, -1);
    const previousScreen = newStack[newStack.length - 1];

    set({
      screen: previousScreen,
      navigationStack: newStack,
    });
  },

  canGoBack: () => {
    const { navigationStack } = get();
    return navigationStack.length > 1;
  },

  getPreviousScreen: () => {
    const { navigationStack } = get();
    if (navigationStack.length <= 1) return null;
    return navigationStack[navigationStack.length - 2];
  },

  getScreenDisplayName: (screen) => {
    return SCREEN_CONFIG[screen]?.displayName || "Back";
  },

  getPreviousScreenDisplayName: () => {
    const previousScreen = get().getPreviousScreen();
    if (!previousScreen) return "Back";
    return get().getScreenDisplayName(previousScreen);
  },
}));
