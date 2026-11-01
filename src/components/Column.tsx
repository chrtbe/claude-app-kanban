"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { type Column as ColumnType, type ColumnColor, type Task } from "@/lib/board";
import { InlineForm } from "./InlineForm";
import { TaskCard } from "./TaskCard";

type Props = {
  column: ColumnType;
  color: ColumnColor;
  tasks: Task[];
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
  onRename,
  onDelete,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [editing, setEditing] = useState(false);

  const commitTitle = (value: string) => {
    const title = value.trim();
    if (title && title !== column.title) onRename(title);
    setEditing(false);
  };

  return (
    <section
      ref={setNodeRef}
      aria-label={column.title}
      style={{ "--accent": `var(--c-${color})` } as React.CSSProperties}
      className={`flex w-[85vw] shrink-0 snap-start flex-col gap-3 rounded-xl border-t-4 border-t-[var(--accent)] p-3 transition-[background-color,box-shadow] sm:w-72 ${
        isOver
          ? "bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] ring-2 ring-[var(--accent)]"
          : "bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] dark:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)]"
      }`}
    >
      <header className="flex items-center justify-between gap-2 rounded-lg bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-1 py-0.5">
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
            className="w-full rounded border border-line bg-card px-2 py-1 text-sm font-semibold outline-none"
          />
        ) : (
          <h2
            onDoubleClick={() => setEditing(true)}
            title="Double-click to rename"
            className="flex-1 cursor-text px-1 text-sm font-semibold"
          >
            <span aria-hidden className="mr-2 inline-block size-2 rounded-full bg-[var(--accent)]" />
            {column.title}
            <span className="ml-2 font-normal text-muted">{tasks.length}</span>
          </h2>
        )}
        <button
          onClick={() => {
            if (tasks.length === 0 || confirm(`Delete "${column.title}" and its ${tasks.length} task(s)?`)) {
              onDelete();
            }
          }}
          aria-label={`Delete column ${column.title}`}
          className="rounded px-1.5 text-muted hover:bg-red-500/15 hover:text-red-500"
        >
          ✕
        </button>
      </header>

      <SortableContext items={column.taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-8 flex-col gap-2">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
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
