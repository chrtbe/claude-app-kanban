import type { Board } from "./board";

/** Swap this implementation (e.g. for an API or database) without touching the UI. */
export type BoardStorage = {
  load(): Board | null;
  save(board: Board): void;
};

const KEY = "kanban-board";

export const localStorageBoard: BoardStorage = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Board) : null;
    } catch {
      return null;
    }
  },
  save(board) {
    try {
      localStorage.setItem(KEY, JSON.stringify(board));
    } catch {
      // storage full or unavailable; the board keeps working in memory
    }
  },
};
