'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/src/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { useProfileSetup } from '@/src/app/hooks/useProfileSetup';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';

interface AdditionalInfoModalProps {
    isOpen: boolean;
    onProfileComplete: () => void;
    onClose?: () => void;
}

export function AdditionalInfoModal({ isOpen, onProfileComplete, onClose }: AdditionalInfoModalProps) {
    const {
        formState,
        setFormState,
        hobbies,
        hobbiesLoading,
        error,
        loading,
        isFormValid,
        handleSubmit,
    } = useProfileSetup();

    const getLucideIcon = (name: string): LucideIcon => {
        const icons = LucideIcons as unknown as Record<string, LucideIcon>;
        return icons[name] ?? LucideIcons.HelpCircle;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onProfileComplete);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && onClose) {
            onClose();
        }
    };

    const toggleHobby = (hobbyId: string) => {
        setFormState((prev) => {
            const newHobbies = prev.selectedHobbies.includes(hobbyId)
                ? prev.selectedHobbies.filter((id) => id !== hobbyId)
                : [...prev.selectedHobbies, hobbyId];
            return { ...prev, selectedHobbies: newHobbies };
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center space-y-2">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Conecta por Aficiones
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Cuéntanos sobre ti para encontrar personas con intereses similares
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <Card className="border-border/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Información Básica</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nombre de usuario *</Label>
                                    <Input
                                        id="username"
                                        placeholder="Tu nombre de usuario"
                                        value={formState.username}
                                        onChange={(e) => setFormState((prev) => ({ ...prev, username: e.target.value }))}
                                        className="bg-input border-border focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Rango de edad</Label>
                                    <Select
                                        value={formState.age}
                                        onValueChange={(value) => setFormState((prev) => ({ ...prev, age: value }))}
                                    >
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
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Ubicación (opcional)</Label>
                                <Input
                                    id="location"
                                    placeholder="Ciudad, País"
                                    value={formState.location}
                                    onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
                                    className="bg-input border-border focus:ring-ring"
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
                                        const isSelected = formState.selectedHobbies.includes(hobby.id);
                                        return (
                                            <button
                                                key={hobby.id}
                                                type="button"
                                                onClick={() => toggleHobby(hobby.id)}
                                                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:scale-105 ${isSelected
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border bg-card hover:border-primary/50"
                                                    }`}
                                            >
                                                <Icon className="w-6 h-6" />
                                                <span className="text-sm font-medium text-center">{hobby.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="border-border/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Preferencias de Chat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="conversationType">Tipo de conversación *</Label>
                                <Select
                                    value={formState.conversationType}
                                    onValueChange={(value) => setFormState((prev) => ({ ...prev, conversationType: value }))}
                                >
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
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Cuéntanos sobre ti (opcional)</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Una breve descripción sobre ti y lo que te gusta hacer..."
                                    value={formState.bio}
                                    onChange={(e) => setFormState((prev) => ({ ...prev, bio: e.target.value }))}
                                    className="bg-input border-border focus:ring-ring min-h-[80px]"
                                    maxLength={200}
                                />
                                <p className="text-xs text-muted-foreground text-right">{formState.bio.length}/200 caracteres</p>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={!isFormValid}
                            className="bg-primary hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            Encontrar Mi Sala
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

