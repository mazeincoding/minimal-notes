import { create } from "zustand";
import { TNote } from "@/types/note";

type NotesStore = {
  notes: TNote[];
  activeNote: TNote | null;
  setActiveNote: (note: TNote | null) => void;
  search: string;
  setSearch: (search: string) => void;
  createNote: ({ title }: { title: string }) => void;
  updateNote: ({
    id,
    title,
    content,
  }: {
    id: string;
    title: string;
    content: string;
  }) => void;
  loadNotes: () => Promise<void>;
};

// Debounce utility for update operations
const debounceMap = new Map<string, NodeJS.Timeout>();

const debounce = (key: string, fn: () => void, delay: number) => {
  const existingTimeout = debounceMap.get(key);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  const timeout = setTimeout(() => {
    fn();
    debounceMap.delete(key);
  }, delay);

  debounceMap.set(key, timeout);
};

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  activeNote: null,
  setActiveNote: (note) => set({ activeNote: note }),
  search: "",
  setSearch: (search) => set({ search }),

  loadNotes: async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const notes = await response.json();
        set({ notes });
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  },

  createNote: ({ title }) => {
    const date = new Date().toISOString();
    const notes = get().notes;

    const newNote = {
      id: crypto.randomUUID(),
      title: title || "New note",
      content: "",
      createdAt: date,
      updatedAt: date,
    };

    // Update store instantly
    set({
      notes: [...notes, newNote],
    });

    // Sync to database in background
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    }).catch((error) => {
      console.error("Failed to create note in database:", error);
      // If database sync fails, set activeNote to null
      // set({ activeNote: null });
    });
  },

  updateNote: ({ id, title, content }) => {
    const notes = get().notes;
    const updatedNotes = notes.map((n) =>
      n.id === id
        ? { ...n, title, content, updatedAt: new Date().toISOString() }
        : n
    );

    // Update store instantly
    set({
      notes: updatedNotes,
      activeNote: updatedNotes.find((n) => n.id === id) || null,
    });

    // Debounced database sync (500ms delay)
    debounce(
      `update-${id}`,
      async () => {
        try {
          await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
          });
        } catch (error) {
          console.error("Failed to update note in database:", error);
        }
      },
      500
    );
  },
}));
