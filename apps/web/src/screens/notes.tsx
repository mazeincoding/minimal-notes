"use client";
import { cn, formatTime, groupNotesByMonth } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SearchIcon } from "lucide-react";
import { useNotesStore } from "@/stores/notes-store";
import { useScreenStore } from "@/stores/screen-store";
import { TNote } from "@/types/note";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

export function Notes() {
  const { notes, search, loadNotes } = useNotesStore();
  const { screen } = useScreenStore();
  const groupedNotes = groupNotesByMonth(notes);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 h-full px-6 fixed inset-0 pt-[4.2rem] z-10 bg-background-secondary transition-transform duration-300 ease-in-out",
        screen === "notes" || screen === "editor"
          ? "translate-x-0"
          : "translate-x-full"
      )}
    >
      <div className="flex flex-col gap-4 h-full">
        <h1 className="text-3xl font-bold">Notes</h1>
        <SearchNotes />
        <section className="flex flex-col gap-3 overflow-y-auto h-full">
          {groupedNotes.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              {search ? "No notes found" : "Notes will appear here"}
            </p>
          )}
          {groupedNotes.map(({ monthKey, notes }) => (
            <MonthGroup key={monthKey} monthKey={monthKey} notes={notes} />
          ))}
        </section>
      </div>
    </div>
  );
}

function MonthGroup({ monthKey, notes }: { monthKey: string; notes: TNote[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">{monthKey}</h2>
      <AnimatePresence>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NoteCard({ note }: { note: TNote }) {
  const { setActiveNote } = useNotesStore();
  const { setScreen } = useScreenStore();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
      layout
    >
      <Card
        onClick={() => {
          setActiveNote(note);
          setScreen("editor");
        }}
      >
        <h1 className="text-base font-semibold">{note.title}</h1>
        <p className="text-[0.85rem] text-muted-foreground">
          {formatTime(note.createdAt)}
        </p>
      </Card>
    </motion.div>
  );
}

function SearchNotes() {
  const { search, setSearch } = useNotesStore();

  return (
    <div className="relative z-50">
      <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search"
        className="bg-foreground/5 border-none h-9 pl-8 mt-0.5"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
