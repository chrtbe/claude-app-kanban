"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  placeholder: string;
  buttonLabel: string;
  onSubmit: (value: string) => void;
};

/** Collapsed "+ label" button that expands into a single-input form. */
export function InlineForm({ placeholder, buttonLabel, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const close = () => {
    setValue("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted hover:bg-hover hover:text-fg"
      >
        <Plus aria-hidden className="size-4" />
        {buttonLabel}
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const title = value.trim();
        if (title) onSubmit(title);
        close();
      }}
      className="flex flex-col gap-2"
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && close()}
        placeholder={placeholder}
        className="rounded-md border border-line bg-card px-3 py-1.5 text-sm outline-none focus:border-focus focus:ring-2 focus:ring-focus/30"
      />
      <div className="flex gap-2">
        <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-on-primary hover:bg-primary-hover">Add</button>
        <button type="button" onClick={close} className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-hover">
          Cancel
        </button>
      </div>
    </form>
  );
}
