'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import { Label } from '@/src/components/ui/label';
import { Checkbox } from '@/src/components/ui/checkbox';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

function resolveIcon(iconName: string | null): LucideIcon | null {
    if (!iconName) return null;
    const key = iconName.charAt(0).toUpperCase() + iconName.slice(1) as keyof typeof LucideIcons;
    const icon = LucideIcons[key];
    return typeof icon === 'function' ? (icon as LucideIcon) : null;
}

interface Hobby {
    id: string;
    name: string;
    icon: string | null;
}

interface EditableHobbiesProps<T extends FieldValues, Name extends Path<T> = Path<T>> {
    name: Name;
    label: string;
    userHobbies: Hobby[] | undefined;
    allHobbies: Hobby[];
    hobbiesLoading: boolean;
    control: Control<T>;
    updateFn: (field: Name, value: any) => Promise<void>;
    readOnly?: boolean;
}

export function EditableHobbies<T extends FieldValues, Name extends Path<T> = Path<T>>({
    name,
    label,
    userHobbies,
    allHobbies,
    hobbiesLoading,
    control,
    updateFn,
    readOnly = false,
}: EditableHobbiesProps<T, Name>) {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedHobbyIds, setSelectedHobbyIds] = useState<string[]>([]);

    useEffect(() => {
        if (!isEditing) {
            setSelectedHobbyIds(userHobbies?.map(h => h.id) || []);
        }
    }, [userHobbies, isEditing]);

    const onSave = async () => {
        setIsSaving(true);
        const hobbiesToSave = allHobbies.filter(hobby => selectedHobbyIds.includes(hobby.id));
        await updateFn(name, hobbiesToSave);
        setIsSaving(false);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSelectedHobbyIds(userHobbies?.map(h => h.id) || []);
        setIsEditing(false);
    };

    const toggleHobby = (hobbyId: string) => {
        setSelectedHobbyIds(prev =>
            prev.includes(hobbyId) ? prev.filter(id => id !== hobbyId) : [...prev, hobbyId]
        );
    };

    return (
        <motion.div layout className="border-b border-border/50 py-4">
            <div className="flex items-start justify-between mb-2">
                <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
                {!isEditing && !readOnly && (
                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!isEditing ? (
                    <motion.div
                        key="view"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                    >
                        <div className="flex flex-wrap gap-2 mt-1">
                    {userHobbies && userHobbies.length > 0 ? (
                        userHobbies.map((hobby) => {
                            const IconComponent = resolveIcon(hobby.icon);
                            return (
                                <Badge key={hobby.id} variant="secondary" className="flex items-center gap-2 py-1 px-3">
                                    {IconComponent ? <IconComponent className="h-4 w-4" /> : <span className="h-4 w-4 text-xs">{hobby.icon}</span>}
                                    <span className="font-normal">{hobby.name}</span>
                                </Badge>
                            );
                        })
                    ) : (
                        <span className="text-muted-foreground italic text-sm">{t('profile.editable.no_hobbies')}</span>
                    )}
                </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="edit"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                <Card className="mt-2 border-dashed">
                    <CardContent className="p-4">
                        {hobbiesLoading ? (
                            <div className="flex items-center justify-center space-y-4 h-32">
                                <div className="h-8 w-8 border-2 border-primary/30 border-t-primary animate-spin rounded-full" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {allHobbies.map((hobby) => {
                                    const IconComponent = resolveIcon(hobby.icon);
                                    return (
                                        <motion.div
                                            key={hobby.id}
                                            layout
                                            className="flex flex-col items-center justify-center gap-2"
                                        >
                                            <label
                                                htmlFor={`hobby-${hobby.id}`}
                                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 w-full h-full cursor-pointer transition-colors ${selectedHobbyIds.includes(hobby.id)
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border bg-card hover:border-primary/50'
                                                    }`}
                                            >
                                                {IconComponent ? <IconComponent className="h-6 w-6 mb-1" /> : <span className="h-6 w-6 mb-1 text-xs">{hobby.icon}</span>}
                                                <span className="text-center text-sm">{hobby.name}</span>
                                            </label>
                                            <Checkbox
                                                id={`hobby-${hobby.id}`}
                                                className="hidden"
                                                checked={selectedHobbyIds.includes(hobby.id)}
                                                onCheckedChange={() => toggleHobby(hobby.id)}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="mt-4 flex gap-2">
                            <Button type="button" size="sm" onClick={onSave} disabled={isSaving || hobbiesLoading}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {t('profile.editable.save_hobbies')}
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
                                <X className="mr-2 h-4 w-4" />
                                {t('profile.editable.cancel')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
