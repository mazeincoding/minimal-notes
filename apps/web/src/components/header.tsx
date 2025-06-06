"use client";
import { Button } from "./ui/button";
import { ChevronLeft, PlusIcon } from "lucide-react";
import { useNotesStore } from "@/stores/notes-store";
import { useScreenStore } from "@/stores/screen-store";
import { useSession } from "@/lib/auth-client";

export function Header() {
  const { setActiveNote, createNote } = useNotesStore();
  const { screen, setScreen, goBack, canGoBack, getPreviousScreenDisplayName } =
    useScreenStore();
  const { data: session } = useSession();

  if (screen === "home") {
    return null;
  }

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
        className="!bg-transparent h-auto w-auto p-1 !text-primary gap-1.5 disabled:opacity-75"
        onClick={handleBack}
        disabled={!canGoBack()}
      >
        <ChevronLeft className="!size-6 flex-shrink-0" />
        <span className="text-[1rem] font-medium mt-0.5">
          {getPreviousScreenDisplayName()}
        </span>
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="!bg-transparent h-auto w-auto p-1 !text-primary"
        disabled={!session}
        onClick={() => {
          createNote({
            title: "New note",
          });
        }}
      >
        <PlusIcon className="w-4 h-4 flex-shrink-0" />
      </Button>
    </div>
  );
}
