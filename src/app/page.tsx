import { SquareKanban } from "lucide-react";
import { BoardLoader } from "@/components/BoardLoader";

export default function Home() {
  return (
    <>
      <header className="border-b border-line bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6">
          <SquareKanban aria-hidden className="size-5 text-muted" />
          <h1 className="text-sm font-semibold">Kanban Board</h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-6">
        <BoardLoader />
      </main>
    </>
  );
}
