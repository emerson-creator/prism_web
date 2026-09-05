import { useEffect, useState } from "react";

interface UseApiFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Runs an async fetcher on mount (and whenever a dependency changes),
 * tracking loading/error state and guarding against setting state after
 * the component has unmounted or the dependencies have already changed
 * (the classic "cancelled" flag pattern).
 *
 * `enabled` lets callers delay the fetch — e.g. until auth has hydrated —
 * without needing a separate early-return effect.
 */
export function useApiFetch<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList,
  options?: { enabled?: boolean; fallbackError?: string },
): UseApiFetchResult<T> {
  const enabled = options?.enabled ?? true;
  const fallbackError = options?.fallbackError ?? "Something went wrong";

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      setIsLoading(true);
      setError(null);

      return fetcher()
        .then((result) => {
          if (cancelled) return;
          setData(result);
        })
        .catch((err) => {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : fallbackError);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, isLoading, error };
}
