'use client';

import { useState, useMemo, useEffect } from 'react';

// Tipos para los datos del formulario y las aficiones
interface ProfileFormState {
    username: string;
    age: string;
    location: string;
    selectedHobbies: string[];
    conversationType: string;
    bio: string;
}

interface Hobby {
    id: string;
    name: string;
    icon: string;
}

export function useProfileSetup() {
    const [formState, setFormState] = useState<ProfileFormState>({
        username: '',
        age: '',
        location: '',
        selectedHobbies: [],
        conversationType: '',
        bio: '',
    });

    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [hobbiesLoading, setHobbiesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHobbies = async () => {
            try {
                setHobbiesLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/hobbies`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('No se pudieron cargar las aficiones.');
                }
                const data = await response.json();
                setHobbies(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar aficiones.');
            } finally {
                setHobbiesLoading(false);
            }
        };

        fetchHobbies();
    }, []);

    const isFormValid = useMemo(() => {
        return formState.username.trim() !== '' && formState.selectedHobbies.length > 0 && formState.conversationType !== '';
    }, [formState.username, formState.selectedHobbies, formState.conversationType]);

    const handleSubmit = async (onSuccess: () => void) => {
        if (!isFormValid) {
            setError('Por favor, completa todos los campos requeridos (*).');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/user/complete-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        username: formState.username,
                        bio: formState.bio,
                        age_range: formState.age,
                        location: formState.location,
                        selected_hobbies: formState.selectedHobbies,
                        conversation_type: formState.conversationType
                    }),
                credentials: 'include'
            });

            if (response.ok) {
                onSuccess();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Ocurrió un error al guardar tu perfil.');
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
        }

        setLoading(false);
    };

    return {
        formState,
        setFormState,
        hobbies,
        hobbiesLoading,
        error,
        loading,
        isFormValid,
        handleSubmit,
    };
}
