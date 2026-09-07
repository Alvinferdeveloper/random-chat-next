
import { useState } from 'react';

export function useFavoriteRoom(roomId: string, initialIsFavorite: boolean = false) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isLoading, setIsLoading] = useState(false);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        // Optimistic update
        const previousState = isFavorite;
        setIsFavorite(!isFavorite);
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/${roomId}/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error('Failed to toggle favorite');
            }
        } catch (error) {
            // Revert on error
            console.error('Error toggling favorite:', error);
            setIsFavorite(previousState);
        } finally {
            setIsLoading(false);
        }
    };

    return { isFavorite, toggleFavorite, isLoading };
}
