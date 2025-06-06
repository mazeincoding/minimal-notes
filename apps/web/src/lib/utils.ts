// Generic utilities

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TNote } from "@/types/note";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: now.getFullYear() !== d.getFullYear() ? "numeric" : undefined,
    });
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return "Just now";
  }
}

export function groupNotesByMonth(notes: TNote[]) {
  const groups = new Map<string, TNote[]>();

  notes.forEach((note) => {
    const monthKey = new Date(note.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    if (!groups.has(monthKey)) {
      groups.set(monthKey, []);
    }
    groups.get(monthKey)!.push(note);
  });

  // Sort groups by date (newest first) and sort notes within each group by last updated
  return Array.from(groups.entries())
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([monthKey, groupNotes]) => ({
      monthKey,
      notes: groupNotes.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    }));
}
