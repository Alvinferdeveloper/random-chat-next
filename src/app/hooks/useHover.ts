'use client';

import { useState, useEffect } from 'react';

export function useHover() {
    const [hasHover, setHasHover] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(hover: hover)');

        const updateHoverSupport = () => {
            setHasHover(mediaQuery.matches);
        };

        updateHoverSupport();
        mediaQuery.addEventListener('change', updateHoverSupport);

        // Cleanup listener on component unmount
        return () => mediaQuery.removeEventListener('change', updateHoverSupport);
    }, []);

    return hasHover;
}
