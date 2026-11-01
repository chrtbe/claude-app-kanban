import { describe, expect, it } from "vitest";
import {
  addColumn,
  addTask,
  columnColor,
  createInitialBoard,
  deleteColumn,
  deleteTask,
  moveTask,
  renameColumn,
  updateTask,
} from "./board";

const setup = () => {
  let board = createInitialBoard();
  const [a, b] = board.columns;
  board = addTask(board, a.id, "one");
  board = addTask(board, a.id, "two");
  board = addTask(board, a.id, "three");
  return { board, a: a.id, b: b.id, ids: board.columns[0].taskIds };
};

describe("board", () => {
  it("starts with three empty columns", () => {
    expect(createInitialBoard().columns.map((c) => c.title)).toEqual([
      "To Do",
      "In Progress",
      "Done",
    ]);
  });

  it("adds, renames and deletes columns", () => {
    let board = addColumn(createInitialBoard(), "Review");
    const id = board.columns[3].id;
    board = renameColumn(board, id, "QA");
    expect(board.columns[3].title).toBe("QA");
    expect(deleteColumn(board, id).columns).toHaveLength(3);
  });

  it("gives each column a distinct color and reuses freed ones", () => {
    let board = addColumn(createInitialBoard(), "Review");
    expect(new Set(board.columns.map((c) => c.color)).size).toBe(4);
    const freed = board.columns[1].color;
    board = deleteColumn(board, board.columns[1].id);
    board = addColumn(board, "QA");
    expect(board.columns[3].color).toBe(freed);
  });

  it("falls back to a position-based color for columns without one", () => {
    const column = { id: "x", title: "Old", taskIds: [] };
    expect(columnColor(column, 0)).toBe("indigo");
    expect(columnColor(column, 7)).toBe("emerald");
  });

  it("deleting a column removes its tasks", () => {
    const { board, a, ids } = setup();
    const next = deleteColumn(board, a);
    expect(ids.every((id) => !(id in next.tasks))).toBe(true);
  });

  it("adds, updates and deletes tasks", () => {
    const { board, ids } = setup();
    const updated = updateTask(board, ids[0], { title: "uno" });
    expect(updated.tasks[ids[0]].title).toBe("uno");
    const removed = deleteTask(updated, ids[0]);
    expect(removed.columns[0].taskIds).toEqual([ids[1], ids[2]]);
    expect(ids[0] in removed.tasks).toBe(false);
  });

  it("moves a task to another column at an index", () => {
    const { board, a, b, ids } = setup();
    const moved = moveTask(moveTask(board, ids[0], b), ids[1], b, 0);
    expect(moved.columns.find((c) => c.id === b)!.taskIds).toEqual([ids[1], ids[0]]);
    expect(moved.columns.find((c) => c.id === a)!.taskIds).toEqual([ids[2]]);
  });

  it("reorders within a column", () => {
    const { board, a, ids } = setup();
    const moved = moveTask(board, ids[0], a, 2);
    expect(moved.columns[0].taskIds).toEqual([ids[1], ids[2], ids[0]]);
  });

  it("ignores unknown ids", () => {
    const { board } = setup();
    expect(moveTask(board, "nope", "nope")).toBe(board);
  });
});
