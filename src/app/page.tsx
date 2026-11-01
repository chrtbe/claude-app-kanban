import { BoardLoader } from "@/components/BoardLoader";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="mb-4 sm:mb-6 text-xl font-semibold tracking-tight">Kanban Board</h1>
      <BoardLoader />
    </main>
  );
}
