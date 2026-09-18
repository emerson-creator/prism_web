// components/modules/product/Pagination.tsx
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({
  page,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-between border-t border-border pt-6"
    >
      <EdgeLink
        page={page - 1}
        disabled={page <= 1}
        searchParams={searchParams}
        direction="prev"
      />

      <ul className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "gap" ? (
            <li
              key={`gap-${i}`}
              className="px-1.5 text-sm text-muted-foreground"
            >
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={buildHref(p, searchParams)}
                aria-current={p === page ? "page" : undefined}
                className={[
                  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm transition-colors",
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ul>

      <EdgeLink
        page={page + 1}
        disabled={page >= totalPages}
        searchParams={searchParams}
        direction="next"
      />
    </nav>
  );
}

function EdgeLink({
  page,
  disabled,
  searchParams,
  direction,
}: {
  page: number;
  disabled: boolean;
  searchParams: Record<string, string | undefined>;
  direction: "prev" | "next";
}) {
  const label = direction === "prev" ? "Previous" : "Next";
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;

  if (disabled) {
    return (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground/40">
        {direction === "prev" && <Icon className="h-3.5 w-3.5" />}
        {label}
        {direction === "next" && <Icon className="h-3.5 w-3.5" />}
      </span>
    );
  }

  return (
    <Link
      href={buildHref(page, searchParams)}
      className={[
        "group flex cursor-pointer items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
        direction === "next" && "flex-row-reverse",
      ].join(" ")}
    >
      <Icon
        className={[
          "h-3.5 w-3.5 transition-transform",
          direction === "prev"
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5",
        ].join(" ")}
      />
      {label}
    </Link>
  );
}

function buildHref(
  page: number,
  searchParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

/** Windowed page list: always shows first, last, and a range around current, with "gap" markers for ellipsis. */
function getPageList(current: number, total: number): (number | "gap")[] {
  const delta = 1;
  const range: number[] = [];
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  const pages: (number | "gap")[] = [1];
  if (range[0] > 2) pages.push("gap");
  pages.push(...range);
  if (range[range.length - 1] < total - 1) pages.push("gap");
  if (total > 1) pages.push(total);

  return pages;
}
