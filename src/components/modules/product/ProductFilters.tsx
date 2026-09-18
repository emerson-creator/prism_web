"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { Search, X } from "lucide-react";
import type { Category } from "@/libs/types";

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "";

  function updateParams(next: { search?: string; category?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.search !== undefined) {
      if (next.search) params.set("search", next.search);
      else params.delete("search");
    }
    if (next.category !== undefined) {
      if (next.category) params.set("category", next.category);
      else params.delete("category");
    }

    // Any filter change resets pagination back to page 1.
    params.delete("page");

    const qs = params.toString();
    startTransition(() => {
      router.replace(`/products${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  }

  function commitSearch(value: string) {
    updateParams({ search: value });
  }

  const hasActiveFilters = currentSearch || currentCategory;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        value={currentSearch}
        isPending={isPending}
        onCommit={commitSearch}
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <FilterChip
          label="All"
          active={!currentCategory}
          onClick={() => updateParams({ category: "" })}
        />
        {categories.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.name}
            active={currentCategory === cat.name}
            onClick={() => updateParams({ category: cat.name })}
          />
        ))}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              startTransition(() =>
                router.replace("/products", { scroll: false }),
              );
            }}
            className="ml-1 cursor-pointer text-[12px] font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function SearchInput({
  value: urlValue,
  isPending,
  onCommit,
}: {
  value: string;
  isPending: boolean;
  onCommit: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== urlValue) {
      inputRef.current.value = urlValue;
    }
  }, [urlValue]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(nextValue: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onCommit(nextValue), 400);
  }

  function clearSearch() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (inputRef.current) inputRef.current.value = "";
    onCommit("");
  }

  return (
    <div className="relative w-full sm:max-w-xs" aria-busy={isPending}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
      />
      <input
        ref={inputRef}
        type="text"
        defaultValue={urlValue}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Search products…"
        className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-8 text-[13.5px] text-foreground outline-none transition-colors focus:border-foreground"
      />
      <button
        type="button"
        aria-label="Clear search"
        onClick={clearSearch}
        className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "cursor-pointer rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
