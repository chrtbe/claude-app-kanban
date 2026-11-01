"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { useState } from "react";
import type { ColumnColor, Task } from "@/lib/board";

type Props = {
  task: Task;
  onUpdate: (changes: Partial<Omit<Task, "id">>) => void;
  onDelete: () => void;
};

/** Visual card, shared by the in-column item and the drag overlay. */
export function TaskCardView({
  task,
  lifted = false,
  color,
}: {
  task: Task;
  lifted?: boolean;
  color?: ColumnColor;
}) {
  return (
    <div
      style={color ? ({ "--accent": `var(--c-${color})` } as React.CSSProperties) : undefined}
      className={`rounded-lg border border-line bg-card p-3 text-sm shadow-sm ${
        lifted ? "rotate-2 scale-105 cursor-grabbing shadow-xl ring-2 ring-[var(--accent)]" : ""
      }`}
    >
      <p className="font-medium">{task.title}</p>
      {task.description && <p className="mt-1 text-muted">{task.description}</p>}
    </div>
  );
}

export function TaskCard({ task, onUpdate, onDelete }: Props) {
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
            className="flex flex-col gap-2 rounded-lg border border-line bg-card p-3 text-sm"
          >
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
              aria-label="Task title"
              className="rounded border border-line bg-card px-2 py-1 outline-none focus:border-muted"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Task description"
              placeholder="Description (optional)"
              rows={2}
              className="rounded border border-line bg-card px-2 py-1 outline-none focus:border-muted"
            />
            <div className="flex gap-2">
              <button className="rounded bg-primary px-3 py-1 text-on-primary">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="px-3 py-1 text-muted">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="group relative cursor-grab touch-none" {...attributes} {...listeners}>
            <TaskCardView task={task} />
            <div className="absolute right-2 top-2 flex gap-1 text-xs [@media(hover:hover)]:hidden [@media(hover:hover)]:group-hover:flex">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setTitle(task.title);
                  setDescription(task.description ?? "");
                  setEditing(true);
                }}
                className="rounded bg-hover px-1.5 py-0.5 hover:bg-line"
              >
                Edit
              </button>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onDelete}
                aria-label={`Delete ${task.title}`}
                className="rounded bg-hover px-1.5 py-0.5 hover:bg-red-500/15 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
