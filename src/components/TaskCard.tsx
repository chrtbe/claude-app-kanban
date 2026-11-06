"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ColumnColor, Task } from "@/lib/board";

type Props = {
  task: Task;
  color: ColumnColor;
  /** True briefly after the task landed in this column. */
  arrived: boolean;
  onUpdate: (changes: Partial<Omit<Task, "id">>) => void;
  onDelete: () => void;
};

/** Visual card, shared by the in-column item and the drag overlay. */
export function TaskCardView({
  task,
  color,
  lifted = false,
  arrived = false,
}: {
  task: Task;
  color: ColumnColor;
  lifted?: boolean;
  arrived?: boolean;
}) {
  return (
    <div className="relative" style={{ "--accent": `var(--c-${color})` } as React.CSSProperties}>
      <div
        className={`border-[1.5px] border-[var(--accent)] bg-card p-3 text-sm transition-[border-radius,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          lifted
            ? "rotate-1 scale-105 cursor-grabbing rounded-[var(--r-card-hover)] shadow-xl ring-2 ring-[var(--accent)]/40"
            : "rounded-[var(--r-card)] hover:rounded-[var(--r-card-hover)]"
        }`}
      >
        <p className="font-medium">{task.title}</p>
        {task.description && <p className="mt-1 text-muted">{task.description}</p>}
      </div>
      {arrived && (
        <span
          aria-hidden
          className="arrive-ring pointer-events-none absolute -inset-0.5 rounded-[var(--r-card-hover)] border-2 border-[var(--accent)] shadow-[0_0_16px_var(--accent)] [animation:arrive_700ms_ease-out_forwards]"
        />
      )}
    </div>
  );
}

export function TaskCard({ task, color, arrived, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: editing,
  });

  const save = () => {
    const next = title.trim();
    if (next) onUpdate({ title: next, description: description.trim() || undefined });
    setEditing(false);
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={isDragging ? "opacity-30" : ""}
      >
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="flex flex-col gap-2 rounded-[var(--r-card)] border-[1.5px] border-focus bg-card p-3 text-sm"
          >
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
              aria-label="Task title"
              className="rounded border border-line bg-card px-2 py-1 outline-none focus:border-focus focus:ring-2 focus:ring-focus/30"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Task description"
              placeholder="Description (optional)"
              rows={2}
              className="rounded border border-line bg-card px-2 py-1 outline-none focus:border-focus focus:ring-2 focus:ring-focus/30"
            />
            <div className="flex gap-2">
              <button className="rounded-md bg-primary px-3 py-1 font-medium text-on-primary hover:bg-primary-hover">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-md px-3 py-1 text-muted hover:bg-hover">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="group relative cursor-grab touch-none" {...attributes} {...listeners}>
            <TaskCardView task={task} color={color} arrived={arrived} />
            <div className="absolute right-2 top-2 flex gap-1 text-xs [@media(hover:hover)]:hidden [@media(hover:hover)]:group-hover:flex">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setTitle(task.title);
                  setDescription(task.description ?? "");
                  setEditing(true);
                }}
                className="rounded-md bg-surface p-1 text-muted ring-1 ring-line hover:text-fg"
                aria-label={`Edit ${task.title}`}
                title="Edit"
              >
                <Pencil aria-hidden className="size-3.5" />
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onDelete}
                aria-label={`Delete ${task.title}`}
                className="rounded-md bg-surface p-1 text-muted ring-1 ring-line hover:text-danger"
                title="Delete"
              >
                <Trash2 aria-hidden className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
