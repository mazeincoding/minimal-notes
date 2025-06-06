import { create } from "zustand";
import { TNote } from "@/types/note";
import { getErrorMessage, getErrorCode } from "@/types/api";
import { createAlert } from "./alert-store";
import { useScreenStore } from "./screen-store";

type NotesStore = {
  notes: TNote[];
  activeNote: TNote | null;
  setActiveNote: (note: TNote | null) => void;
  search: string;
  setSearch: (search: string) => void;
  isInitialLoad: boolean;
  newlyCreatedNoteIds: Set<string>;
  clearNewlyCreatedNote: (id: string) => void;
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
  isInitialLoad: true,
  newlyCreatedNoteIds: new Set(),
  clearNewlyCreatedNote: (id) => {
    const newSet = new Set(get().newlyCreatedNoteIds);
    newSet.delete(id);
    set({ newlyCreatedNoteIds: newSet });
  },

  loadNotes: async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const notes = await response.json();
        set({ notes, isInitialLoad: false });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorCode = getErrorCode(response, errorData.error);
        const message = getErrorMessage(errorCode);
        createAlert({
          title: "Error",
          message,
          buttons: [{ text: "OK", primary: true }],
        });
      }
    } catch (error) {
      createAlert({
        title: "Error",
        message: "Failed to load notes. Please refresh the page.",
        buttons: [{ text: "OK", primary: true }],
      });
      console.error("Failed to load notes:", error);
    }
  },

  createNote: ({ title }) => {
    const date = new Date().toISOString();
    const notes = get().notes;
    const newlyCreatedNoteIds = get().newlyCreatedNoteIds;

    const newNote = {
      id: crypto.randomUUID(),
      title: title || "New note",
      content: "",
      createdAt: date,
      updatedAt: date,
    };

    // Track this as a newly created note
    const updatedNewlyCreatedIds = new Set(newlyCreatedNoteIds);
    updatedNewlyCreatedIds.add(newNote.id);

    // Update store instantly
    set({
      notes: [...notes, newNote],
      newlyCreatedNoteIds: updatedNewlyCreatedIds,
    });

    // Sync to database
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then(async (response) => {
        setTimeout(() => {
          set({ activeNote: newNote });
          useScreenStore.getState().setScreen("editor");
        }, 300);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorCode = getErrorCode(response, errorData.error);
          const message = getErrorMessage(errorCode);
          createAlert({
            title: "Error",
            message,
            buttons: [{ text: "OK", primary: true }],
          });

          // Remove the note from store if creation failed
          const currentNotes = get().notes;
          set({
            notes: currentNotes.filter((n) => n.id !== newNote.id),
            activeNote: null,
          });
        }
      })
      .catch((error) => {
        createAlert({
          title: "Error",
          message: "Failed to create note. Please try again.",
          buttons: [{ text: "OK", primary: true }],
        });

        // Remove the note from store if creation failed
        const currentNotes = get().notes;
        set({
          notes: currentNotes.filter((n) => n.id !== newNote.id),
          activeNote: null,
        });
        console.error("Failed to create note in database:", error);
      });
  },

  updateNote: ({ id, title, content }) => {
    const notes = get().notes;
    const currentActiveNote = get().activeNote;

    const updatedNotes = notes.map((n) =>
      n.id === id
        ? { ...n, title, content, updatedAt: new Date().toISOString() }
        : n
    );

    // Only update activeNote if it's currently the note being updated
    const shouldUpdateActiveNote = currentActiveNote?.id === id;
    const newActiveNote = shouldUpdateActiveNote
      ? updatedNotes.find((n) => n.id === id) || null
      : currentActiveNote;

    // Update store instantly
    set({
      notes: updatedNotes,
      activeNote: newActiveNote,
    });

    // Debounced database sync (500ms delay)
    debounce(
      `update-${id}`,
      async () => {
        try {
          const response = await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorCode = getErrorCode(response, errorData.error);
            const message = getErrorMessage(errorCode);
            createAlert({
              title: "Error",
              message,
              buttons: [{ text: "OK", primary: true }],
            });
          }
        } catch (error) {
          createAlert({
            title: "Error",
            message: "Failed to save changes. Please try again.",
            buttons: [{ text: "OK", primary: true }],
          });
          console.error("Failed to update note in database:", error);
        }
      },
      500
    );
  },
}));
