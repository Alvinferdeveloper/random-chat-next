'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRoom, RoomSchema, RoomFormValues } from '../hooks/useCreateRoom';
import { useCategories } from '../hooks/useCategories';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { CategorySelector } from './CategorySelector';
import { Loader2, Type, FileText, AlignLeft, Rocket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';

export interface RoomData {
    id: string;
    name: string;
}

interface CreateRoomFormProps {
    onRoomCreated: (room: RoomData) => void;
}

export function CreateRoomForm({ onRoomCreated }: CreateRoomFormProps) {
    const { t } = useTranslation();
    const { createRoom, loading, error } = useCreateRoom();
    const { categories, loading: categoriesLoading } = useCategories();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RoomFormValues>({
        resolver: zodResolver(RoomSchema),
    });

    useEffect(() => {
        setValue('categoryIds', selectedCategories);
    }, [selectedCategories, setValue]);

    const onSubmit = async (data: RoomFormValues) => {
        const newRoom = await createRoom(data);
        if (newRoom) {
            onRoomCreated(newRoom);
        }
    };

    return (
        <Card className="max-w-xl mx-auto border-border/50 shadow-xl bg-card/50 backdrop-blur-xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle className="text-xl">{t('rooms.create.form.basic_info')}</CardTitle>
                    <CardDescription>
                        {t('rooms.create.form.basic_info_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pb-5">

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">{t('rooms.create.form.name_label')}</Label>
                        <div className="relative">
                            <Type className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                {...register('name')}
                                className="pl-9 bg-background/50 focus:bg-background transition-all"
                                placeholder={t('rooms.create.form.name_placeholder')}
                            />
                        </div>
                        {errors.name && <p className="text-sm text-destructive font-medium animate-pulse">{errors.name.message}</p>}
                    </div>

                    {/* Short Description */}
                    <div className="space-y-2">
                        <Label htmlFor="short_description" className="text-sm font-medium">{t('rooms.create.form.short_desc_label')}</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="short_description"
                                {...register('short_description')}
                                className="pl-9 bg-background/50 focus:bg-background transition-all"
                                placeholder={t('rooms.create.form.short_desc_placeholder')}
                            />
                        </div>
                        {errors.short_description && <p className="text-sm text-destructive font-medium animate-pulse">{errors.short_description.message}</p>}
                    </div>

                    {/* Full Description */}
                    <div className="space-y-2">
                        <Label htmlFor="full_description" className="text-sm font-medium">{t('rooms.create.form.full_desc_label')}</Label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                                id="full_description"
                                {...register('full_description')}
                                className="pl-9 min-h-[120px] bg-background/50 focus:bg-background transition-all resize-none"
                                placeholder={t('rooms.create.form.full_desc_placeholder')}
                            />
                        </div>
                        {errors.full_description && <p className="text-sm text-destructive font-medium animate-pulse">{errors.full_description.message}</p>}
                    </div>

                    {/* Categories */}
                    <CategorySelector
                        categories={categories}
                        selectedIds={selectedCategories}
                        onChange={setSelectedCategories}
                        loading={categoriesLoading}
                    />
                    {errors.categoryIds && <p className="text-sm text-destructive font-medium animate-pulse">{errors.categoryIds.message}</p>}
                </CardContent>

                <CardFooter className="flex flex-col gap-4 bg-secondary/10 pt-6 border-t border-border/50">
                    {error && (
                        <div className="w-full p-3 text-sm text-destructive bg-destructive/10 rounded-md text-center border border-destructive/20">
                            {error}
                        </div>
                    )}
                    <Button type="submit" disabled={loading} className="w-full cursor-pointer h-11 text-base shadow-lg shadow-primary/20">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('rooms.create.form.creating')}
                            </>
                        ) : (
                            <>
                                <Rocket className="mr-2 h-4 w-4" />
                                {t('rooms.create.form.continue')}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}