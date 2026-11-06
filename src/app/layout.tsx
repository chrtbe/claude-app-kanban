import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "A minimalistic Kanban board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-page font-sans text-fg antialiased">
        <div aria-hidden className="blob -left-24 -top-24 size-96 bg-[var(--c-indigo)]" />
        <div aria-hidden className="blob -bottom-32 right-0 size-[28rem] bg-[var(--c-violet)] [animation-delay:-6s]" />
        {children}
      </body>
    </html>
  );
}
