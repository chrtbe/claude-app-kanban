"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Circle, CircleCheck, CircleDot, Diamond, Hexagon, Square, Trash2, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type Column as ColumnType, type ColumnColor, type Task } from "@/lib/board";
import { InlineForm } from "./InlineForm";
import { TaskCard } from "./TaskCard";

const COLUMN_ICONS: Record<ColumnColor, LucideIcon> = {
  indigo: Circle,
  emerald: CircleDot,
  amber: CircleCheck,
  rose: Diamond,
  sky: Square,
  violet: Hexagon,
};

export type Arrival = { taskId: string; columnId: string; n: number };

type Props = {
  column: ColumnType;
  color: ColumnColor;
  tasks: Task[];
  isLast: boolean;
  /** Set for ~1s after a task changed column; drives the arrival effects. */
  arrival: Arrival | null;
  onRename: (title: string) => void;
  onDelete: () => void;
  onAddTask: (title: string) => void;
  onUpdateTask: (taskId: string, changes: Partial<Omit<Task, "id">>) => void;
  onDeleteTask: (taskId: string) => void;
};

export function Column({
  column,
  color,
  tasks,
  isLast,
  arrival,
  onRename,
  onDelete,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [editing, setEditing] = useState(false);
  const Icon = COLUMN_ICONS[color];
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const arrivedHere = arrival?.columnId === column.id ? arrival : null;

  // Confetti when a task lands in the last column (e.g. Done).
  const arrivalN = arrivedHere?.n;
  useEffect(() => {
    if (arrivalN === undefined || !isLast || reduce) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    void import("canvas-confetti").then(({ default: confetti }) =>
      confetti({
        particleCount: 70,
        spread: 70,
        startVelocity: 28,
        ticks: 90,
        disableForReducedMotion: true,
        colors: ["#1a7f37", "#3fb950", "#0969da", "#d29922", "#ab7df8"],
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + 60) / window.innerHeight,
        },
      }),
    );
  }, [arrivalN, isLast, reduce]);

  const commitTitle = (value: string) => {
    const title = value.trim();
    if (title && title !== column.title) onRename(title);
    setEditing(false);
  };

  return (
    <section
      ref={(node) => {
        setNodeRef(node);
        sectionRef.current = node;
      }}
      aria-label={column.title}
      style={{ "--accent": `var(--c-${color})` } as React.CSSProperties}
      className={`relative flex w-[85vw] shrink-0 snap-start flex-col gap-2 border bg-[color-mix(in_srgb,var(--accent)_5%,var(--surface))] p-2 transition-[border-radius,transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:w-72 ${
        isOver
          ? "scale-[1.02] rounded-[var(--r-col-over)] border-focus ring-2 ring-focus/40"
          : "rounded-[var(--r-col)] border-line"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-[3px] rounded-b-full bg-[var(--accent)]"
      />
      <header className="flex items-center justify-between gap-2 px-1 py-1">
        {editing ? (
          <input
            autoFocus
            defaultValue={column.title}
            aria-label="Column title"
            onBlur={(e) => commitTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle(e.currentTarget.value);
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-full rounded-md border border-line bg-card px-2 py-1 text-sm font-semibold outline-none focus:border-focus focus:ring-2 focus:ring-focus/30"
          />
        ) : (
          <h2
            onDoubleClick={() => setEditing(true)}
            title="Double-click to rename"
            className="flex flex-1 cursor-text items-center gap-2 px-1 text-sm font-semibold"
          >
            <motion.span
              key={arrivedHere?.n ?? "idle"}
              aria-hidden
              className="inline-flex"
              animate={arrivedHere && !reduce ? { scale: [1, 1.6, 1], rotate: [0, -20, 12, 0] } : undefined}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <Icon className="size-4 text-[var(--accent)]" />
            </motion.span>
            {column.title}
            <span
              className="relative inline-flex h-5 min-w-6 items-center justify-center overflow-hidden rounded-full bg-counter px-2 text-xs font-medium"
              style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent)" }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={tasks.length}
                  initial={reduce ? false : { y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: -14, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                >
                  {tasks.length}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
        )}
        <button
          onClick={() => {
            if (tasks.length === 0 || confirm(`Delete "${column.title}" and its ${tasks.length} task(s)?`)) {
              onDelete();
            }
          }}
          aria-label={`Delete column ${column.title}`}
          title="Delete column"
          className="rounded-md p-1.5 text-muted hover:bg-hover hover:text-danger"
        >
          <Trash2 aria-hidden className="size-4" />
        </button>
      </header>

      <SortableContext items={column.taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-8 flex-col gap-2">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                color={color}
                arrived={arrivedHere?.taskId === task.id}
                onUpdate={(changes) => onUpdateTask(task.id, changes)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      <InlineForm placeholder="Task title" buttonLabel="Add task" onSubmit={onAddTask} />
    </section>
  );
}
