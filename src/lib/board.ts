export type Task = {
  id: string;
  title: string;
  description?: string;
};

export type Column = {
  id: string;
  title: string;
  taskIds: string[];
};

export type Board = {
  columns: Column[];
  tasks: Record<string, Task>;
};

const newId = () => crypto.randomUUID();

export const createInitialBoard = (): Board => ({
  columns: ["To Do", "In Progress", "Done"].map((title) => ({
    id: newId(),
    title,
    taskIds: [],
  })),
  tasks: {},
});

export const addColumn = (board: Board, title: string): Board => ({
  ...board,
  columns: [...board.columns, { id: newId(), title, taskIds: [] }],
});

export const renameColumn = (board: Board, columnId: string, title: string): Board => ({
  ...board,
  columns: board.columns.map((c) => (c.id === columnId ? { ...c, title } : c)),
});

export const deleteColumn = (board: Board, columnId: string): Board => {
  const column = board.columns.find((c) => c.id === columnId);
  if (!column) return board;
  const tasks = { ...board.tasks };
  column.taskIds.forEach((id) => delete tasks[id]);
  return { columns: board.columns.filter((c) => c.id !== columnId), tasks };
};

export const addTask = (
  board: Board,
  columnId: string,
  title: string,
  description?: string,
): Board => {
  const task: Task = { id: newId(), title, ...(description ? { description } : {}) };
  return {
    columns: board.columns.map((c) =>
      c.id === columnId ? { ...c, taskIds: [...c.taskIds, task.id] } : c,
    ),
    tasks: { ...board.tasks, [task.id]: task },
  };
};

export const updateTask = (
  board: Board,
  taskId: string,
  changes: Partial<Omit<Task, "id">>,
): Board =>
  board.tasks[taskId]
    ? { ...board, tasks: { ...board.tasks, [taskId]: { ...board.tasks[taskId], ...changes } } }
    : board;

export const deleteTask = (board: Board, taskId: string): Board => {
  const tasks = { ...board.tasks };
  delete tasks[taskId];
  return {
    columns: board.columns.map((c) => ({
      ...c,
      taskIds: c.taskIds.filter((id) => id !== taskId),
    })),
    tasks,
  };
};

export const findColumnOfTask = (board: Board, taskId: string): Column | undefined =>
  board.columns.find((c) => c.taskIds.includes(taskId));

/** Moves a task to `toColumnId` at `index` (clamped); works within and across columns. */
export const moveTask = (
  board: Board,
  taskId: string,
  toColumnId: string,
  index: number = Infinity,
): Board => {
  if (!board.tasks[taskId] || !board.columns.some((c) => c.id === toColumnId)) return board;
  const withoutTask = board.columns.map((c) => ({
    ...c,
    taskIds: c.taskIds.filter((id) => id !== taskId),
  }));
  return {
    ...board,
    columns: withoutTask.map((c) => {
      if (c.id !== toColumnId) return c;
      const at = Math.max(0, Math.min(index, c.taskIds.length));
      return { ...c, taskIds: [...c.taskIds.slice(0, at), taskId, ...c.taskIds.slice(at)] };
    }),
  };
};
