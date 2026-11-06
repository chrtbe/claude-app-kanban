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
import { useEffect, useRef, useState } from "react";
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
import { Column, type Arrival } from "./Column";
import { InlineForm } from "./InlineForm";
import { TaskCardView } from "./TaskCard";

export function Board({ storage = localStorageBoard }: { storage?: BoardStorage }) {
  // Client-only (see BoardLoader), so reading storage during init is safe.
  const [board, setBoard] = useState<BoardType>(() => storage.load() ?? createInitialBoard());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [arrival, setArrival] = useState<Arrival | null>(null);
  const startColumnId = useRef<string | null>(null);
  const arrivalTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
    startColumnId.current = findColumnOfTask(board, String(active.id))?.id ?? null;
  };

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
    const taskId = String(active.id);
    // Status change = the task ended up in another column than it started in.
    const landed = findColumnOfTask(board, taskId);
    if (landed && startColumnId.current && landed.id !== startColumnId.current) {
      setArrival({ taskId, columnId: landed.id, n: Date.now() });
      clearTimeout(arrivalTimer.current);
      arrivalTimer.current = setTimeout(() => setArrival(null), 1000);
    }
    if (!over) return;
    const overId = String(over.id);
    update((b) => {
      const column = findColumnOfTask(b, taskId);
      if (!column || !column.taskIds.includes(overId)) return b;
      return moveTask(b, taskId, column.id, column.taskIds.indexOf(overId));
    });
  };

  const activeTask = activeId ? board.tasks[activeId] : null;
  const activeIndex = activeId ? board.columns.findIndex((c) => c.taskIds.includes(activeId)) : -1;
  // The lifted card takes the color of whichever column it is currently over.
  const activeColor = activeIndex >= 0 ? columnColor(board.columns[activeIndex], activeIndex) : "indigo";

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
            isLast={i === board.columns.length - 1}
            arrival={arrival}
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
        {activeTask ? <TaskCardView task={activeTask} color={activeColor} lifted /> : null}
      </DragOverlay>
    </DndContext>
  );
}
