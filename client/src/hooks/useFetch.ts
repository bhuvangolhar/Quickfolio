import { useState, useEffect, useCallback, useRef } from "react";

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(fetcher: () => Promise<T>): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Store fetcher reference in a ref to avoid infinite re-render loops when inline functions are passed
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const loadData = useCallback(async () => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      if (!isCancelled) {
        setData(result);
      }
    } catch (err: unknown) {
      if (!isCancelled) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Failed to fetch data";
        setError(message);
      }
    } finally {
      if (!isCancelled) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetcherRef
      .current()
      .then((result) => {
        if (isMounted) {
          setData(result);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === "string"
              ? err
              : "Failed to fetch data";
          setError(message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error, refetch: loadData };
}