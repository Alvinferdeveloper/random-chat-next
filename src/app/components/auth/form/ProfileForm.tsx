'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { ProfileFormValues } from '@/src/lib/validators/user';

interface Hobby {
    id: string;
    name: string;
    icon: string;
}

interface ProfileFormProps {
    hobbies: Hobby[];
    hobbiesLoading: boolean;
    onSubmit: (values: ProfileFormValues) => void;
    error: string | null;
}

const getLucideIcon = (name: string): LucideIcon => {
    const icons = LucideIcons as unknown as Record<string, LucideIcon>;
    return icons[name] ?? LucideIcons.HelpCircle;
};

export function ProfileForm({ hobbies, hobbiesLoading, onSubmit, error }: ProfileFormProps) {
    const { control, handleSubmit, formState: { errors, isSubmitting, isValid }, watch, setValue } = useFormContext<ProfileFormValues>();

    const selectedHobbies = watch('selectedHobbies');
    const bio = watch('bio') || '';

    const toggleHobby = (hobbyId: string) => {
        const currentHobbies = selectedHobbies || [];
        const newHobbies = currentHobbies.includes(hobbyId)
            ? currentHobbies.filter((id) => id !== hobbyId)
            : [...currentHobbies, hobbyId];
        setValue('selectedHobbies', newHobbies, { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Nombre de usuario *</Label>
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="username"
                                        placeholder="Tu nombre de usuario"
                                        className="bg-input border-border focus:ring-ring"
                                    />
                                )}
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Rango de edad</Label>
                            <Controller
                                name="age"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="bg-input border-border">
                                            <SelectValue placeholder="Selecciona tu edad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="RANGE_19_24">19-24 años</SelectItem>
                                            <SelectItem value="RANGE_25_34">25-34 años</SelectItem>
                                            <SelectItem value="RANGE_35_44">35-44 años</SelectItem>
                                            <SelectItem value="RANGE_45_PLUS">45+ años</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación (opcional)</Label>
                        <Controller
                            name="location"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="location"
                                    placeholder="Ciudad, País"
                                    className="bg-input border-border focus:ring-ring"
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Tus Aficiones *</CardTitle>
                    <CardDescription>Selecciona al menos una afición para encontrar personas afines</CardDescription>
                </CardHeader>
                <CardContent>
                    {hobbiesLoading ? (
                        <p className="text-center text-muted-foreground">Cargando aficiones...</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {hobbies.map((hobby) => {
                                const Icon = getLucideIcon(hobby.icon);
                                const isSelected = selectedHobbies?.includes(hobby.id);
                                return (
                                    <button
                                        key={hobby.id}
                                        type="button"
                                        onClick={() => toggleHobby(hobby.id)}
                                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105 ${isSelected
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border bg-card hover:border-primary/50'
                                            }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-sm font-medium text-center">{hobby.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {errors.selectedHobbies && <p className="text-red-500 text-xs mt-2">{errors.selectedHobbies.message}</p>}
                </CardContent>
            </Card>

            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Preferencias de Chat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="conversationType">Tipo de conversación *</Label>
                        <Controller
                            name="conversationType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue placeholder="¿Qué tipo de chat prefieres?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASUAL">Conversación casual</SelectItem>
                                        <SelectItem value="DEEP">Conversaciones profundas</SelectItem>
                                        <SelectItem value="LEARNING">Aprender cosas nuevas</SelectItem>
                                        <SelectItem value="SHARING">Compartir experiencias</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.conversationType && <p className="text-red-500 text-xs mt-1">{errors.conversationType.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Cuéntanos sobre ti (opcional)</Label>
                        <Controller
                            name="bio"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="bio"
                                    placeholder="Una breve descripción sobre ti y lo que te gusta hacer..."
                                    className="bg-input border-border focus:ring-ring min-h-[80px]"
                                    maxLength={200}
                                />
                            )}
                        />
                        <p className="text-xs text-muted-foreground text-right">{bio.length}/200 caracteres</p>
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                    </div>
                </CardContent>
            </Card>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="bg-primary hover:bg-accent transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Guardando...' : 'Encontrar Mi Sala'}
                </Button>
            </div>
        </form>
    );
}
