"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/stores/notes-store";
import { useScreenStore } from "@/stores/screen-store";
import { useEffect, useRef } from "react";

export function Editor() {
  const { activeNote, updateNote } = useNotesStore();
  const { screen } = useScreenStore();

  return (
    <div
      className={cn(
        "flex flex-col gap-2 h-full px-6 fixed inset-0 pt-[4.5rem] z-20 bg-background transition-transform duration-300 ease-in-out pb-6",
        activeNote && screen === "editor" ? "translate-x-0" : "translate-x-full"
      )}
    >
      <TitleInput />
      <div className="flex-1">
        <Textarea
          value={activeNote?.content || ""}
          onChange={(e) => {
            updateNote({
              id: activeNote?.id || "",
              title: activeNote?.title || "",
              content: e.target.value,
            });
          }}
          className="!text-base text-foreground/85 bg-transparent border-none outline-none resize-none !ring-0 p-0 h-full"
          placeholder="Write anything..."
          rows={3}
        />
      </div>
    </div>
  );
}

function TitleInput() {
  const { activeNote, updateNote } = useNotesStore();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const previousNoteIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeNote && titleInputRef.current) {
      // Only focus if this is a different note than before
      if (previousNoteIdRef.current !== activeNote.id) {
        titleInputRef.current.focus();
        previousNoteIdRef.current = activeNote.id;
      }
    } else if (!activeNote) {
      previousNoteIdRef.current = null;
    }
  }, [activeNote]);

  return (
    <Input
      ref={titleInputRef}
      type="text"
      value={activeNote?.title || ""}
      onChange={(e) =>
        updateNote({
          id: activeNote?.id || "",
          title: e.target.value,
          content: activeNote?.content || "",
        })
      }
      className="!text-2xl font-bold bg-transparent border-none outline-none !ring-0 p-0"
      placeholder="Title"
    />
  );
}
