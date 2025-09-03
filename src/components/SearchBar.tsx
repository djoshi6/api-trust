"use client";
import { useState } from "react";

export default function SearchBar({
  onSearch,
  placeholder = "Search an API...",
}: {
  onSearch?: (q: string) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(q.trim());
      }}
      className="relative mx-auto w-full max-w-md"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-full bg-pill px-5 py-3
          text-ink-900 placeholder:text-ink-500
          ring-1 ring-ring shadow-[var(--shadow-card)]
          outline-none
        "
      />
      <button
        type="submit"
        className="
          absolute right-1 top-1 h-9 rounded-full
          bg-forest-600 px-4 text-sm font-medium text-white
          hover:bg-forest-700 transition-colors
        "
      >
        Search
      </button>
    </form>
  );
}