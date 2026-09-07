"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useApiFetch } from "@/libs/hooks/useApiFetch";
import * as api from "@/libs/api";
import { validateRequired } from "@/libs/validation";

export default function AdminCategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  const {
    data: categoriesResponse,
    isLoading,
    error: loadError,
  } = useApiFetch(() => api.fetchCategories({ limit: 100 }), [refreshKey], {
    fallbackError: "Could not load categories",
  });

  const categories = categoriesResponse?.data ?? [];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateRequired(name, "Category name");
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      await api.createCategory({ name });
      setName("");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not create category",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string, categoryName: string) {
    if (
      !confirm(`Delete "${categoryName}"? Products using it may be affected.`)
    ) {
      return;
    }
    setDeletingId(id);
    setRowError(null);
    try {
      await api.deleteCategory(id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setRowError(
        err instanceof Error ? err.message : "Could not delete category",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Categories
      </h1>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Used to organize products across the catalog.
      </p>

      <form onSubmit={handleCreate} className="mt-6 flex items-start gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formError) setFormError(null);
            }}
            placeholder="New category name"
            className={[
              "h-11 w-full rounded-lg border bg-background px-3.5 text-[14px] text-foreground outline-none transition-colors",
              formError
                ? "border-red-400 focus:border-red-500"
                : "border-border focus:border-foreground",
            ].join(" ")}
          />
          {formError && (
            <p className="mt-1.5 text-[12px] text-red-600">{formError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex h-11 shrink-0 items-center rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Adding…" : "Add"}
        </button>
      </form>

      {rowError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
          {rowError}
        </p>
      )}

      {isLoading ? (
        <p className="mt-8 text-[13px] text-muted-foreground">
          Loading categories…
        </p>
      ) : loadError ? (
        <p className="mt-8 text-[13px] text-red-600">{loadError}</p>
      ) : categories.length === 0 ? (
        <p className="mt-8 text-[13px] text-muted-foreground">
          No categories yet.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className="text-[13.5px] text-foreground">{cat.name}</span>
              <button
                type="button"
                aria-label={`Delete ${cat.name}`}
                onClick={() => handleDelete(cat.id, cat.name)}
                disabled={deletingId === cat.id}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
              >
                <Trash2 className="h-[15px] w-[15px]" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
