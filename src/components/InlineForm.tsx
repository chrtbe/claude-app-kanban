"use client";

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
        className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-200/60"
      >
        + {buttonLabel}
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
        className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500"
      />
      <div className="flex gap-2">
        <button className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm text-white">Add</button>
        <button type="button" onClick={close} className="px-3 py-1.5 text-sm text-neutral-500">
          Cancel
        </button>
      </div>
    </form>
  );
}
