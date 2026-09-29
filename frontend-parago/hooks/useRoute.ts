// hooks/useRoute.ts
import { useCallback, useRef, useState, useEffect } from "react";
import { Coord, RouteResult, fetchRoute } from "@/lib/mapbox";

export function useRoute() {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const getRoute = useCallback(async (from: Coord, to: Coord) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    return new Promise<RouteResult | null>((resolve) => {
      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await fetchRoute(from, to);
          setRoute(result);
          resolve(result);
        } catch (e: unknown) {
          if (e instanceof Error && e.name === "AbortError") {
            resolve(null);
            return;
          }
          const msg = e instanceof Error ? e.message : "Failed to fetch route";
          setError(msg);
          setRoute(null);
          resolve(null);
        } finally {
          setLoading(false);
        }
      }, 350);
    });
  }, []);

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    setRoute(null);
    setError(null);
  }, []);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  return { route, loading, error, getRoute, clear };
}