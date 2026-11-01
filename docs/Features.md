# Features

- **Board with columns** – starts with To Do / In Progress / Done.
- **Columns** – add, rename (double-click the title), delete (asks if it holds tasks).
- **Tasks** – add, edit (title + optional description), delete.
- **Drag and drop** – move tasks between columns and reorder within a column (dnd-kit). Mouse, touch and keyboard.
- **Animations** – lifted card while dragging, spring drop, animated add/remove/reflow (Motion).
- **Column colors** – each column gets one of 6 hues (dot, top border, light tint, tinted header); a new column takes the first unused hue. Dragging over a column strengthens its tint and adds a ring; the lifted card gets a ring in its source column's color.
- **Dark mode** – follows the OS setting (no toggle). Colors are CSS variables in `globals.css`.
- **Responsive** – on phones columns are ~85% wide with scroll-snap; card Edit/Delete are always visible on touch devices; touch drag needs a short press so swiping still scrolls.
- **Persistence** – saved in the browser's localStorage.

## Agreed decisions

- Storage sits behind the `BoardStorage` interface (`src/lib/storage.ts`) so it can be swapped for an API/database.
- Board logic lives in pure functions (`src/lib/board.ts`) with unit tests.
- Not yet included: multiple boards, manual theme toggle, per-column color picker, search/filter, dragging columns.
