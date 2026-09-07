/**
 * Small sessionStorage-backed cache with a TTL. Used to let pages render
 * optimistically when a tab remounts from scratch (e.g. the browser
 * discarding a background tab and reloading it) instead of flashing a
 * loading state while data that was already known moments ago is refetched.
 *
 * sessionStorage survives a reload of the same tab but is cleared once the
 * tab is closed, which makes it the right storage for this: it's not a
 * long-term cache, just a bridge across an unexpected remount.
 */

type CacheEnvelope<T> = { value: T; timestamp: number };

export function getSessionCache<T>(key: string, ttlMs: number): T | undefined {
    if (typeof window === 'undefined') return undefined;
    try {
        const raw = window.sessionStorage.getItem(key);
        if (!raw) return undefined;
        const envelope: CacheEnvelope<T> = JSON.parse(raw);
        if (Date.now() - envelope.timestamp > ttlMs) return undefined;
        return envelope.value;
    } catch {
        return undefined;
    }
}

export function setSessionCache<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
        const envelope: CacheEnvelope<T> = { value, timestamp: Date.now() };
        window.sessionStorage.setItem(key, JSON.stringify(envelope));
    } catch {
        // sessionStorage unavailable (e.g. private mode) - safe to ignore
    }
}
