"use client";
import { Button } from "./ui/button";
import { ChevronLeft, PlusIcon } from "lucide-react";
import { useNotesStore } from "@/stores/notes-store";
import { useScreenStore } from "@/stores/screen-store";
import { useEffect } from "react";

export function Header() {
  const { activeNote, setActiveNote, createNote } = useNotesStore();
  const { screen, setScreen, goBack, canGoBack, getPreviousScreen } =
    useScreenStore();

  useEffect(() => {
    console.log(screen);
  }, [screen]);

  if (screen === "home") {
    return null;
  }

  const previousScreen = getPreviousScreen();
  const getBackButtonText = () => {
    switch (previousScreen) {
      case "home":
        return "Home";
      case "notes":
        return "Notes";
      case "editor":
        return "Editor";
      default:
        return "Back";
    }
  };

  const handleBack = () => {
    // Clear active note when leaving editor
    if (screen === "editor") {
      setActiveNote(null);
    }
    goBack();
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 z-50 animate-in fade-in duration-300 blur-none">
      <Button
        variant="ghost"
        size="icon"
        className="!bg-transparent h-auto w-auto p-1 text-primary gap-1.5"
        onClick={handleBack}
        disabled={!canGoBack()}
      >
        <ChevronLeft className="!size-5 flex-shrink-0" />
        <span className="text-[0.95rem] font-medium mt-0.5">
          {getBackButtonText()}
        </span>
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="!bg-transparent h-auto w-auto p-1 text-primary"
        onClick={() => {
          createNote({
            title: "New note",
          });
          setTimeout(() => {
            setScreen("editor");
          }, 300);
        }}
      >
        <PlusIcon className="w-4 h-4 flex-shrink-0" />
      </Button>
    </div>
  );
}
