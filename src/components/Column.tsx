"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import type { Column as ColumnType, Task } from "@/lib/board";
import { InlineForm } from "./InlineForm";
import { TaskCard } from "./TaskCard";

type Props = {
  column: ColumnType;
  tasks: Task[];
  onRename: (title: string) => void;
  onDelete: () => void;
  onAddTask: (title: string) => void;
  onUpdateTask: (taskId: string, changes: Partial<Omit<Task, "id">>) => void;
  onDeleteTask: (taskId: string) => void;
};

export function Column({
  column,
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
      className={`flex w-72 shrink-0 flex-col gap-3 rounded-xl p-3 transition-colors ${
        isOver ? "bg-neutral-200" : "bg-neutral-100"
      }`}
    >
      <header className="flex items-center justify-between gap-2">
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
            className="w-full rounded border border-neutral-300 px-2 py-1 text-sm font-semibold outline-none"
          />
        ) : (
          <h2
            onDoubleClick={() => setEditing(true)}
            title="Double-click to rename"
            className="flex-1 cursor-text px-1 text-sm font-semibold"
          >
            {column.title}
            <span className="ml-2 font-normal text-neutral-400">{tasks.length}</span>
          </h2>
        )}
        <button
          onClick={() => {
            if (tasks.length === 0 || confirm(`Delete "${column.title}" and its ${tasks.length} task(s)?`)) {
              onDelete();
            }
          }}
          aria-label={`Delete column ${column.title}`}
          className="rounded px-1.5 text-neutral-400 hover:bg-red-100 hover:text-red-700"
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
