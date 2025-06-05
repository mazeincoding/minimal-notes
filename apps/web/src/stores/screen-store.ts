import { create } from "zustand";

type Screen = "home" | "notes" | "editor";

interface ScreenStore {
  screen: Screen;
  navigationStack: Screen[];
  setScreen: (screen: Screen) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  getPreviousScreen: () => Screen | null;
}

export const useScreenStore = create<ScreenStore>((set, get) => ({
  screen: "home",
  navigationStack: ["home"],

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
}));
