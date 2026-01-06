'use client';

import { useCallback, useRef, MouseEvent, TouchEvent } from 'react';

interface LongPressOptions {
    shouldPreventDefault?: boolean;
    delay?: number;
}

export const useLongPress = (
    onLongPress: (event: MouseEvent | TouchEvent) => void,
    onClick?: (event: MouseEvent | TouchEvent) => void,
    { shouldPreventDefault = true, delay = 300 }: LongPressOptions = {}
) => {
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const target = useRef<EventTarget | null>(null);

    const start = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (shouldPreventDefault && event.target) {
                event.target.addEventListener('touchend', preventDefault, { passive: false });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(event);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event: MouseEvent | TouchEvent, shouldTriggerClick = true) => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            if (shouldTriggerClick && onClick) {
                onClick(event);
            }
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener('touchend', preventDefault);
            }
        },
        [onClick, shouldPreventDefault]
    );

    const preventDefault = (event: Event) => {
        if (!('touches' in event) || (event as any).touches.length < 2) {
            if (event.cancelable) {
                event.preventDefault();
            }
        }
    };

    return {
        onMouseDown: (e: MouseEvent) => start(e),
        onTouchStart: (e: TouchEvent) => start(e),
        onMouseUp: (e: MouseEvent) => clear(e),
        onMouseLeave: (e: MouseEvent) => clear(e, false),
        onTouchEnd: (e: TouchEvent) => clear(e),
    };
};

export default useLongPress;
