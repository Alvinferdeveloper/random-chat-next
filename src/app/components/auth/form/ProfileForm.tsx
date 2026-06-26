'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
                    <CardTitle className="text-lg">{t('auth.profile_form.basic_info_title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">{t('auth.profile_form.username_label')}</Label>
                            <Controller
                                name="username"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="username"
                                        placeholder={t('auth.profile_form.username_placeholder')}
                                        className="bg-input border-border focus:ring-ring"
                                    />
                                )}
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">{t('auth.profile_form.age_label')}</Label>
                            <Controller
                                name="age"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="bg-input border-border">
                                            <SelectValue placeholder={t('auth.profile_form.age_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="RANGE_19_24">{t('profile.age_range.19_24')}</SelectItem>
                                            <SelectItem value="RANGE_25_34">{t('profile.age_range.25_34')}</SelectItem>
                                            <SelectItem value="RANGE_35_44">{t('profile.age_range.35_44')}</SelectItem>
                                            <SelectItem value="RANGE_45_PLUS">{t('profile.age_range.45_plus')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">{t('auth.profile_form.location_label')}</Label>
                        <Controller
                            name="location"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="location"
                                    placeholder={t('auth.profile_form.location_placeholder')}
                                    className="bg-input border-border focus:ring-ring"
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{t('auth.profile_form.hobbies_title')}</CardTitle>
                    <CardDescription>{t('auth.profile_form.hobbies_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {hobbiesLoading ? (
                        <p className="text-center text-muted-foreground">{t('auth.profile_form.hobbies_loading')}</p>
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
                    <CardTitle className="text-lg">{t('auth.profile_form.chat_preferences_title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="conversationType">{t('auth.profile_form.conversation_type_label')}</Label>
                        <Controller
                            name="conversationType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue placeholder={t('auth.profile_form.conversation_type_placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASUAL">{t('profile.conversation_type.casual')}</SelectItem>
                                        <SelectItem value="DEEP">{t('profile.conversation_type.deep')}</SelectItem>
                                        <SelectItem value="LEARNING">{t('profile.conversation_type.learning')}</SelectItem>
                                        <SelectItem value="SHARING">{t('profile.conversation_type.sharing')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.conversationType && <p className="text-red-500 text-xs mt-1">{errors.conversationType.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">{t('auth.profile_form.bio_label')}</Label>
                        <Controller
                            name="bio"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id="bio"
                                    placeholder={t('auth.profile_form.bio_placeholder')}
                                    className="bg-input border-border focus:ring-ring min-h-[80px]"
                                    maxLength={200}
                                />
                            )}
                        />
                        <p className="text-xs text-muted-foreground text-right">{t('auth.profile_form.bio_char_count', { count: bio.length })}</p>
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                    </div>
                </CardContent>
            </Card>
            {error && <p className="text-red-500 text-center">{t(error)}</p>}
            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="bg-primary hover:bg-accent transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? t('auth.profile_form.submit_loading') : t('auth.profile_form.submit')}
                </Button>
            </div>
        </form>
    );
}
