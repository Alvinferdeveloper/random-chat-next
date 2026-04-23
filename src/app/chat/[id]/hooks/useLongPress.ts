'use client';

import { useCallback, useRef, MouseEvent, TouchEvent } from 'react';

interface LongPressOptions {
    shouldPreventDefault?: boolean;
    delay?: number;
    moveThreshold?: number;
}

export const useLongPress = (
    onLongPress: (event: MouseEvent | TouchEvent) => void,
    onClick?: (event: MouseEvent | TouchEvent) => void,
    { shouldPreventDefault = true, delay = 300, moveThreshold = 10 }: LongPressOptions = {}
) => {
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const target = useRef<EventTarget | null>(null);
    const startPos = useRef<{ x: number; y: number } | null>(null);
    const isLongPressTriggered = useRef(false);

    const start = useCallback(
        (event: MouseEvent | TouchEvent) => {
            isLongPressTriggered.current = false;

            // Record the initial touch/mouse position
            if ('touches' in event && event.touches.length > 0) {
                startPos.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            } else if ('clientX' in event) {
                startPos.current = { x: event.clientX, y: event.clientY };
            }

            if (shouldPreventDefault && event.target) {
                event.target.addEventListener('touchend', preventDefault, { passive: false });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                isLongPressTriggered.current = true;
                onLongPress(event);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const move = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (!startPos.current || !timeout.current) return;

            let currentX: number, currentY: number;
            if ('touches' in event && event.touches.length > 0) {
                currentX = event.touches[0].clientX;
                currentY = event.touches[0].clientY;
            } else if ('clientX' in event) {
                currentX = (event as MouseEvent).clientX;
                currentY = (event as MouseEvent).clientY;
            } else {
                return;
            }

            const dx = Math.abs(currentX - startPos.current.x);
            const dy = Math.abs(currentY - startPos.current.y);

            // If the finger moved beyond the threshold, cancel the long press (user is scrolling)
            if (dx > moveThreshold || dy > moveThreshold) {
                clearTimeout(timeout.current);
                timeout.current = null;
                startPos.current = null;
                if (shouldPreventDefault && target.current) {
                    target.current.removeEventListener('touchend', preventDefault);
                }
            }
        },
        [moveThreshold, shouldPreventDefault]
    );

    const clear = useCallback(
        (event: MouseEvent | TouchEvent, shouldTriggerClick = true) => {
            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = null;
            }
            // Only trigger onClick if long press was NOT triggered
            if (shouldTriggerClick && onClick && !isLongPressTriggered.current) {
                onClick(event);
            }
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener('touchend', preventDefault);
            }
            startPos.current = null;
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
        onTouchMove: (e: TouchEvent) => move(e),
        onMouseMove: (e: MouseEvent) => move(e),
        onMouseUp: (e: MouseEvent) => clear(e),
        onMouseLeave: (e: MouseEvent) => clear(e, false),
        onTouchEnd: (e: TouchEvent) => clear(e),
    };
};

export default useLongPress;
