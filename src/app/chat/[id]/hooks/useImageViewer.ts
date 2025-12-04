'use client'
import { useState } from 'react';

export function useImageViewer() {
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [viewedImageUrl, setViewedImageUrl] = useState<string | null>(null);

    const openImageViewer = (imageUrl: string) => {
        setViewedImageUrl(imageUrl);
        setIsImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setIsImageViewerOpen(false);
        // Delay clearing the image to allow for the closing animation
        setTimeout(() => {
            setViewedImageUrl(null);
        }, 300); // Should match the duration of the transition
    };

    return {
        isImageViewerOpen,
        viewedImageUrl,
        openImageViewer,
        closeImageViewer,
    };
}
