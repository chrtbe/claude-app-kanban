"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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
  columnColor,
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
    // Press-and-hold on touch so swiping still scrolls the board.
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
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
  const activeIndex = activeId ? board.columns.findIndex((c) => c.taskIds.includes(activeId)) : -1;
  const activeColor = activeIndex >= 0 ? columnColor(board.columns[activeIndex], activeIndex) : undefined;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="-mx-4 flex snap-x snap-proximity items-start gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:snap-none sm:gap-4 sm:px-0">
        {board.columns.map((column, i) => (
          <Column
            key={column.id}
            column={column}
            color={columnColor(column, i)}
            tasks={column.taskIds.map((id) => board.tasks[id])}
            onRename={(title) => update((b) => renameColumn(b, column.id, title))}
            onDelete={() => update((b) => deleteColumn(b, column.id))}
            onAddTask={(title) => update((b) => addTask(b, column.id, title))}
            onUpdateTask={(id, changes) => update((b) => updateTask(b, id, changes))}
            onDeleteTask={(id) => update((b) => deleteTask(b, id))}
          />
        ))}
        <div className="w-[85vw] shrink-0 snap-start sm:w-72">
          <InlineForm
            placeholder="Column title"
            buttonLabel="Add column"
            onSubmit={(title) => update((b) => addColumn(b, title))}
          />
        </div>
      </div>
      <DragOverlay dropAnimation={{ duration: 250, easing: "cubic-bezier(0.18, 0.89, 0.32, 1.28)" }}>
        {activeTask ? <TaskCardView task={activeTask} lifted color={activeColor} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
