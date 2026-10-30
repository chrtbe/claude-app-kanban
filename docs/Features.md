# Features

- **Board with columns** – starts with To Do / In Progress / Done.
- **Columns** – add, rename (double-click the title), delete (asks if it holds tasks).
- **Tasks** – add, edit (title + optional description), delete.
- **Drag and drop** – move tasks between columns and reorder within a column (dnd-kit). Mouse, touch and keyboard.
- **Animations** – lifted card while dragging, spring drop, animated add/remove/reflow (Motion).
- **Persistence** – saved in the browser's localStorage.

## Agreed decisions

- Storage sits behind the `BoardStorage` interface (`src/lib/storage.ts`) so it can be swapped for an API/database.
- Board logic lives in pure functions (`src/lib/board.ts`) with unit tests.
- Not yet included: multiple boards, dark mode, search/filter, dragging columns.
