---
name: Kanban Design System
description: Minimal, Primer-inspired Kanban board with organic corners and playful motion.
colors:
  primary: "#1f883d"
  primary-hover: "#1a7f37"
  on-primary: "#ffffff"
  page: "#ffffff"
  surface: "#f6f8fa"
  card: "#ffffff"
  fg: "#1f2328"
  muted: "#4d5762"
  line: "#818b98"
  hover: "#eaeef2"
  counter: "#818b981f"
  focus: "#0969da"
  danger: "#d1242f"
  primary-dark: "#238636"
  primary-hover-dark: "#2ea043"
  page-dark: "#0d1117"
  surface-dark: "#151b23"
  card-dark: "#0d1117"
  fg-dark: "#e6edf3"
  muted-dark: "#9198a1"
  line-dark: "#7d8590"
  hover-dark: "#262c36"
  counter-dark: "#656c7633"
  focus-dark: "#4493f8"
  danger-dark: "#f85149"
  indigo: "#0969da"
  emerald: "#1a7f37"
  amber: "#9a6700"
  rose: "#cf222e"
  sky: "#0a7ea4"
  violet: "#8250df"
  indigo-dark: "#4493f8"
  emerald-dark: "#3fb950"
  amber-dark: "#d29922"
  rose-dark: "#f85149"
  sky-dark: "#39c5cf"
  violet-dark: "#ab7df8"
typography:
  app-title: { fontFamily: Inter, fontSize: 14px, fontWeight: 600 }
  column-title: { fontFamily: Inter, fontSize: 14px, fontWeight: 600 }
  card-title: { fontFamily: Inter, fontSize: 14px, fontWeight: 500 }
  body: { fontFamily: Inter, fontSize: 14px, fontWeight: 400 }
  counter: { fontFamily: Inter, fontSize: 12px, fontWeight: 500 }
rounded:
  control: 6px
  pill: 9999px
spacing:
  unit: 4px
---

# Kanban Design System

Calm at rest, springy in the hand. A GitHub Primer base (neutral surfaces, green primary, blue focus) with two signatures: **leaf-shaped corners** that flip when you interact, and **motion that rewards moving a task**.

Source of truth: CSS variables in `src/app/globals.css`, exposed to Tailwind via `@theme inline` (`bg-surface`, `text-muted`, `border-line`, …). Visual reference: the "Kanban Design System" canvas.

## Color

- Components use **semantic tokens only** (`page`, `surface`, `fg`, …), never raw hex.
- Dark mode follows the OS (`prefers-color-scheme`); every token has a dark value.
- **Column hues** are assigned in order to new columns (first unused hue). A hue drives:
  - the 3px accent bar at the top of the column,
  - the column icon,
  - the counter ring (45% hue),
  - the 1.5px task card border,
  - a 5% tint of the column surface: `color-mix(in srgb, hue 5%, surface)`.
- Contrast: text ≥ 4.5:1, borders/icons/hues ≥ 3:1, in light and dark.

## Typography

- One family: **Inter** (via `next/font`, variable `--font-inter`).
- A compact UI scale: everything is 14px except counters (12px). Hierarchy comes from weight (600 titles, 500 card titles, 400 body) and color (`fg` vs `muted`).

## Shape

- Big–small–big–small corners. On hover or drop-over the pattern **mirrors** (`card` → `card-hover`, `column` → `column-over`), animated with the spring curve.
- Buttons and inputs: 6px. Counters and accent bar: pill.
- Borders: 1px `line` on columns and inputs, 1.5px hue on cards.

## Spacing & layout

- 4px base. Column padding 8, card gap 8, card padding 12, board gap 12 (mobile) / 16 (desktop), page padding 16 / 24.
- Column width 288px (85vw on phones, scroll-snap). Container max 1152px.
- Header: `surface` at 80% + backdrop blur, bottom hairline.

## Depth

- Lifted card: `shadow-xl`, 2px ring in hue at 40%, rotate 1°, scale 1.05.
- Focus: border `focus` + 2px ring `focus` at 30%.
- Drop target column: scale 1.02, border `focus`, 2px ring `focus` at 40%.
- Ambient blobs: indigo + violet, blur 60px, opacity 0.3 (0.2 dark).

## Components

| Component | Spec |
|---|---|
| Primary button | `primary` bg, `on-primary` text, 14/500, 6×12 padding, hover `primary-hover` |
| Ghost button | transparent, `muted` text, hover `hover` bg |
| Add row | Plus icon + label, full width, `muted` → hover `fg` on `hover`; expands into an inline form |
| Icon button | 16px Lucide icon, 6px padding, hover `hover` bg; delete turns `danger` |
| Input | 1px `line`, 6px radius, `card` bg, focus border + ring |
| Counter | 20px pill, `counter` bg, inset 1px ring hue at 45%, 12/500 |
| Task card | `card` bg, 1.5px hue border, `card` radius, 12px padding; edit/delete show on hover (always on touch) |
| Column | tinted surface, `column` radius, accent bar, icon + title + counter + delete, cards, Add task |

Task card states: rest · hover (flipped corners) · lifted (drag overlay, takes the hue of the column below) · placeholder (30% opacity) · editing (`focus` border) · arrived (glow ring).

## Motion

| Effect | Spec |
|---|---|
| Corner flip / column scale | spring, 300ms |
| Drop into place | drop curve, 250ms |
| Enter / exit | opacity 0→1, scale 0.9→1, layout animation (Motion) |
| Counter roll | slide ±14px, spring 500/28 |
| Arrival | glow ring scale 1→1.18 + fade, 700ms; column icon pops (scale 1.6, wobble), 550ms |
| Celebrate | confetti (70 particles) when a task lands in the last column |
| Gestures | pointer drag after 5px; touch drag after 200ms hold |

All motion is disabled under `prefers-reduced-motion`.

## Icons

Lucide, 16px (14px in card actions), 2px stroke, `currentColor`. No emoji.

## Do / Don't

- Do reuse tokens and existing components before adding new ones.
- Do keep effects short (< 1s) and tied to a user action.
- Don't add gradients, heavy shadows at rest, or new font families.
- Don't use color alone to tell columns apart — each hue has its own icon.

## Tokens not in the frontmatter

The linter accepts only single values, so these live here (CSS variables in `globals.css`):

- **Leaf corners** (big–small–big–small): column `28px 10px 28px 10px` → over `10px 28px 10px 28px`; card `16px 6px 16px 6px` → hover `6px 16px 6px 16px`.
- **Column hue icons:** indigo Circle · emerald CircleDot · amber CircleCheck · rose Diamond · sky Square · violet Hexagon.
- **Font stack:** Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif. Base size 14px.
- **Spacing scale:** 4, 8, 12, 16, 24.
- **Motion:** spring `cubic-bezier(0.34, 1.56, 0.64, 1)` 300ms · drop `cubic-bezier(0.18, 0.89, 0.32, 1.28)` 250ms · counter spring stiffness 500 / damping 28 · arrive ring 700ms · icon pop 550ms · blobs 18s.
- **Dark mode:** each color has a `-dark` twin.
