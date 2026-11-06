"use client";

import { motion, useReducedMotion } from "motion/react";
import { COLUMN_ICONS } from "./Column";
import { columnColor, getProgress, type Board } from "@/lib/board";

export function ProgressTracker({ board }: { board: Board }) {
  const reduce = useReducedMotion();
  const { total, donePercent, columns } = getProgress(board);

  return (
    <section
      aria-label="Progress"
      className="mt-2 rounded-[var(--r-col)] border border-line bg-surface p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">Progress</h2>
        <p className="text-sm text-muted">
          <span className="font-semibold text-fg">{donePercent}%</span> done · {total} task{total === 1 ? "" : "s"}
        </p>
      </div>

      <div
        role="img"
        aria-label={columns.map((c) => `${c.title} ${c.percent}%`).join(", ")}
        className="mt-3 flex h-3 gap-0.5 overflow-hidden rounded-full bg-counter"
      >
        {columns.map((c, i) => (
          <motion.div
            key={c.id}
            className="h-full min-w-0 bg-[var(--accent)]"
            style={{ "--accent": `var(--c-${columnColor(board.columns[i], i)})` } as React.CSSProperties}
            initial={false}
            animate={{ width: `${c.percent}%` }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
          />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {columns.map((c, i) => {
          const color = columnColor(board.columns[i], i);
          const Icon = COLUMN_ICONS[color];
          return (
            <li
              key={c.id}
              style={{ "--accent": `var(--c-${color})` } as React.CSSProperties}
              className="flex items-center gap-2 rounded-md px-2 py-1.5"
            >
              <Icon aria-hidden className="size-4 shrink-0 text-[var(--accent)]" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.title}</span>
              <span className="text-xs text-muted">
                {c.count} · {c.percent}%
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
