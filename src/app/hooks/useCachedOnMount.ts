import { useLayoutEffect } from "react";
import { getSessionCache } from "@/src/app/utils/sessionCache";

/**
 * Reads a cached value (see `sessionCache`) before the first paint and, if a
 * fresh one exists, hands it to `onHit` synchronously - before the browser
 * paints - so the caller can seed its state without flashing a loading UI
 * first. `onHit` only runs once, on mount, using the `key`/`ttlMs` passed in
 * on that first render.
 */
export function useCachedOnMount<T>(key: string, ttlMs: number, onHit: (value: T) => void) {
    useLayoutEffect(() => {
        const cached = getSessionCache<T>(key, ttlMs);
        if (cached !== undefined) onHit(cached);
        // Intentionally run only once, on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
