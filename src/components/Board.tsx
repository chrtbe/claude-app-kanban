"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import {
  addColumn,
  addTask,
  createInitialBoard,
  deleteColumn,
  deleteTask,
  findColumnOfTask,
  moveTask,
  renameColumn,
  updateTask,
  type Board as BoardType,
} from "@/lib/board";
import { localStorageBoard, type BoardStorage } from "@/lib/storage";
import { Column } from "./Column";
import { InlineForm } from "./InlineForm";
import { TaskCardView } from "./TaskCard";

export function Board({ storage = localStorageBoard }: { storage?: BoardStorage }) {
  // Client-only (see BoardLoader), so reading storage during init is safe.
  const [board, setBoard] = useState<BoardType>(() => storage.load() ?? createInitialBoard());
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    storage.save(board);
  }, [board, storage]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const update = (fn: (b: BoardType) => BoardType) => setBoard(fn);

  const onDragStart = ({ active }: DragStartEvent) => setActiveId(String(active.id));

  // Move across columns live so the card animates into its new column while dragging.
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const taskId = String(active.id);
    const overId = String(over.id);
    update((b) => {
      const from = findColumnOfTask(b, taskId);
      const overColumn = b.columns.find((c) => c.id === overId) ?? findColumnOfTask(b, overId);
      if (!from || !overColumn || from.id === overColumn.id) return b;
      const overIndex = overColumn.taskIds.indexOf(overId);
      return moveTask(b, taskId, overColumn.id, overIndex === -1 ? Infinity : overIndex);
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over) return;
    const taskId = String(active.id);
    const overId = String(over.id);
    update((b) => {
      const column = findColumnOfTask(b, taskId);
      if (!column || !column.taskIds.includes(overId)) return b;
      return moveTask(b, taskId, column.id, column.taskIds.indexOf(overId));
    });
  };

  const activeTask = activeId ? board.tasks[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex items-start gap-4 overflow-x-auto pb-4">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={column.taskIds.map((id) => board.tasks[id])}
            onRename={(title) => update((b) => renameColumn(b, column.id, title))}
            onDelete={() => update((b) => deleteColumn(b, column.id))}
            onAddTask={(title) => update((b) => addTask(b, column.id, title))}
            onUpdateTask={(id, changes) => update((b) => updateTask(b, id, changes))}
            onDeleteTask={(id) => update((b) => deleteTask(b, id))}
          />
        ))}
        <div className="w-72 shrink-0">
          <InlineForm
            placeholder="Column title"
            buttonLabel="Add column"
            onSubmit={(title) => update((b) => addColumn(b, title))}
          />
        </div>
      </div>
      <DragOverlay dropAnimation={{ duration: 250, easing: "cubic-bezier(0.18, 0.89, 0.32, 1.28)" }}>
        {activeTask ? <TaskCardView task={activeTask} lifted /> : null}
      </DragOverlay>
    </DndContext>
  );
}
