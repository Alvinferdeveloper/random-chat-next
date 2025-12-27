'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema, ProfileData } from '@/src/lib/validators/profile';
import { useProfileSetup } from '@/src/app/hooks/useProfileSetup';

interface Hobby {
    id: string;
    name: string;
    icon: string;
}

export function useUserProfile() {
    const [user, setUser] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { hobbies: allHobbies, hobbiesLoading } = useProfileSetup();

    const form = useForm<ProfileData>({
        resolver: zodResolver(ProfileSchema),
    });

    const fetchUserProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/users/profile`, {
                credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudo cargar el perfil.');
            }
            const data = await response.json();
            setUser(data.user);
            form.reset(data.user);
        } catch (err: any) {
            setError(err.message || 'Error al cargar el perfil.');
        } finally {
            setLoading(false);
        }
    }, [form]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const updateProfileField = async <T extends keyof ProfileData>(field: T, value: ProfileData[T]) => {
        if (!user) return;

        const originalValue = user[field];
        setUser(prevUser => prevUser ? { ...prevUser, [field]: value } : null);

        try {
            const endpoint = field === 'hobbies' ? 'selected_hobbies' : 'hobbies';
            const body = field === 'hobbies'
                ? { [endpoint]: (value as Hobby[]).map(h => h.id) }
                : { [field]: value };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/users/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'No se pudo actualizar el campo.');
            }

            const updatedData = await response.json();
            setUser(updatedData.user);
            form.reset(updatedData.user);

        } catch (err: any) {
            setError(err.message || 'Error al actualizar.');
            if (user) {
                setUser({ ...user, [field]: originalValue });
            }
        }
    };

    const uploadImage = async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            // 1. Get presigned URL from our backend
            const presignedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/users/profile/generate-upload-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: file.name, contentType: file.type }),
                credentials: 'include',
            });

            if (!presignedResponse.ok) {
                throw new Error('No se pudo obtener la URL para subir la imagen.');
            }

            const { signedUploadUrl, publicUrl } = await presignedResponse.json();

            // 2. Upload image to Supabase
            const uploadResponse = await fetch(signedUploadUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            if (!uploadResponse.ok) {
                throw new Error('Error al subir la imagen a Supabase.');
            }

            // 3. Update profile with the new image URL
            await updateProfileField('image', publicUrl);

        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al subir la imagen.');
        } finally {
            setIsUploading(false);
        }
    };


    return {
        user,
        loading,
        error,
        form,
        updateProfileField,
        refetch: fetchUserProfile,
        allHobbies,
        hobbiesLoading,
        uploadImage,
        isUploading,
    };
}
