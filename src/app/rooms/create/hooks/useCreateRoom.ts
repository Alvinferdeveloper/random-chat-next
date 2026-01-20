'use client';

import { useState } from 'react';
import { z } from 'zod';

// Zod Schema for form validation
export const RoomSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres.").max(45, "El nombre no puede exceder los 45 caracteres."),
    short_description: z.string().min(10, "La descripción corta debe tener al menos 10 caracteres.").max(45, "La descripción corta no puede exceder los 100 caracteres."),
    full_description: z.string().min(20, "La descripción completa debe tener al menos 20 caracteres.").max(300, "La descripción completa no puede exceder los 500 caracteres."),
});

export type RoomFormValues = z.infer<typeof RoomSchema>;

interface RoomData {
    id: string;
    name: string;
}

export function useCreateRoom() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState<'banner' | 'icon' | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const createRoom = async (data: RoomFormValues): Promise<RoomData | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Ocurrió un error al crear la sala.');
            }

            return result.data as RoomData;

        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const uploadRoomImage = async (roomId: string, type: 'banner' | 'icon', file: File) => {
        setUploading(type);
        setUploadError(null);

        try {
            // 1. Get presigned URL
            const presignedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/${roomId}/generate-upload-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, contentType: file.type }),
                credentials: 'include',
            });

            const presignedResult = await presignedResponse.json();
            if (!presignedResponse.ok) {
                throw new Error(presignedResult.message || `No se pudo obtener la URL para el ${type}.`);
            }
            const { signedUploadUrl, publicUrl } = presignedResult;

            // 2. Upload to Supabase
            const uploadResponse = await fetch(signedUploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            if (!uploadResponse.ok) {
                throw new Error(`Error al subir el ${type} a Supabase.`);
            }

            // 3. Confirm upload with our backend
            const fieldToUpdate = type === 'banner' ? 'server_banner' : 'server_icon';
            const confirmResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/${roomId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [fieldToUpdate]: publicUrl }),
                credentials: 'include',
            });

            const confirmResult = await confirmResponse.json();
            if (!confirmResponse.ok) {
                throw new Error(confirmResult.message || `No se pudo confirmar la subida del ${type}.`);
            }

            return { success: true, publicUrl };

        } catch (err: any) {
            setUploadError(err.message);
            return { success: false, publicUrl: null };
        } finally {
            setUploading(null);
        }
    };

    return {
        createRoom,
        uploadRoomImage,
        loading,
        error,
        uploading,
        uploadError,
    };
}
