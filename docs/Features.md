# Features

- **Board with columns** – starts with To Do / In Progress / Done.
- **Columns** – add, rename (double-click the title), delete (asks if it holds tasks).
- **Tasks** – add, edit (title + optional description), delete.
- **Drag and drop** – move tasks between columns and reorder within a column (dnd-kit). Mouse, touch and keyboard.
- **Animations** – lifted card while dragging, spring drop, animated add/remove/reflow (Motion).
- **GitHub-style look** – Primer colors, Inter font (Google Fonts via `next/font`), Lucide icons, slim header bar, counter pills, green primary buttons, blue focus rings.
- **Column colors** – each column has its own hue: 3px top bar, shape icon (circle, dot, check, diamond, square, hexagon), tinted counter pill and a faint tint. A new column takes the first unused hue. Task cards have a 1.5px border in their column's color; the dragged card changes color live while over another column.
- **Contrast** – text meets WCAG AA (4.5:1), borders/icons/hues 3:1, in light and dark. Checked with a ratio script when the palette changed.
- **Dynamic shapes** – organic corners (asymmetric radii) that morph on hover and drag; the drop target bulges; soft blurred blobs drift in the background. Tokens are CSS variables in `globals.css`.
- **Status-change animations** – when a task lands in another column: glow ring on the card, column icon pops, counters roll, and confetti when it lands in the last column (`canvas-confetti`). Short (<1s); all off with reduced motion.
- **Dark mode** – follows the OS setting (no toggle), using Primer dark colors as CSS variables in `globals.css`.
- **Responsive** – on phones columns are ~85% wide with scroll-snap; card Edit/Delete are always visible on touch devices; touch drag needs a short press so swiping still scrolls.
- **Progress tracker** – panel below the board: stacked bar with each column's share of all tasks (column hue, animated), "% done" (= last column) and a per-column list with count and percent. Legend is 1 / 2 / 3 columns on phone / tablet / desktop.
- **Persistence** – saved in the browser's localStorage.

## Agreed decisions

- Storage sits behind the `BoardStorage` interface (`src/lib/storage.ts`) so it can be swapped for an API/database.
- Board logic lives in pure functions (`src/lib/board.ts`) with unit tests.
- UI follows GitHub Projects (Primer); icons from `lucide-react`, font Inter.
- Design system (tokens, components, motion) is documented in `docs/DESIGN.md`.
- Not yet included: multiple boards, manual theme toggle, per-column color picker, search/filter, dragging columns.
