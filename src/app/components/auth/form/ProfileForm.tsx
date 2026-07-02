'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/button';
import { ProfileFormValues } from '@/src/lib/validators/user';
import { Check } from 'lucide-react';

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

const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.12,
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1],
        },
    }) as const,
};

const sections = [
    { key: 'basic', label: 'auth.profile_form.basic_info_title' },
    { key: 'hobbies', label: 'auth.profile_form.hobbies_title' },
    { key: 'preferences', label: 'auth.profile_form.chat_preferences_title' },
];

function HobbySkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />
            ))}
        </div>
    );
}

export function ProfileForm({ hobbies, hobbiesLoading, onSubmit, error }: ProfileFormProps) {
    const { t } = useTranslation();
    const { control, handleSubmit, formState: { errors, isSubmitting, isValid }, watch, setValue } = useFormContext<ProfileFormValues>();

    const selectedHobbies = watch('selectedHobbies');
    const bio = watch('bio') || '';

    const toggleHobby = (hobbyId: string) => {
        const current = selectedHobbies || [];
        const next = current.includes(hobbyId)
            ? current.filter((id) => id !== hobbyId)
            : [...current, hobbyId];
        setValue('selectedHobbies', next, { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-center gap-2 pb-1">
                {sections.map((s, i) => (
                    <React.Fragment key={s.key}>
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                                {i + 1}
                            </div>
                            <span className="hidden sm:inline text-xs text-muted-foreground">{t(s.label)}</span>
                        </div>
                        {i < sections.length - 1 && (
                            <div className="h-px w-6 bg-border/60" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <motion.section
                custom={0}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
            >
                <h3 className="text-sm font-semibold text-foreground mb-4">
                    {t('auth.profile_form.basic_info_title')}
                </h3>
                <div className="space-y-4">
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
                                        className="h-11"
                                    />
                                )}
                            />
                            {errors.username && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs font-medium text-destructive"
                                >
                                    {errors.username.message}
                                </motion.p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">{t('auth.profile_form.age_label')}</Label>
                            <Controller
                                name="age"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="h-11">
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
                                    className="h-11"
                                />
                            )}
                        />
                    </div>
                </div>
            </motion.section>

            <div className="border-t border-border/40" />

            <motion.section
                custom={1}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="mb-1">
                    <h3 className="text-sm font-semibold text-foreground">
                        {t('auth.profile_form.hobbies_title')}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {t('auth.profile_form.hobbies_description')}
                    </p>
                </div>
                {hobbiesLoading ? (
                    <HobbySkeleton />
                ) : (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.03 } },
                        }}
                    >
                        {hobbies.map((hobby) => {
                            const Icon = getLucideIcon(hobby.icon);
                            const isSelected = selectedHobbies?.includes(hobby.id);
                            return (
                                <motion.button
                                    key={hobby.id}
                                    type="button"
                                    onClick={() => toggleHobby(hobby.id)}
                                    whileTap={{ scale: 0.95 }}
                                    animate={isSelected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                    className={`
                                        relative p-3 rounded-lg border-2 transition-colors duration-200
                                        flex flex-col items-center gap-2 cursor-pointer
                                        ${isSelected
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:border-primary/50 hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary"
                                        >
                                            <Check className="h-2.5 w-2.5 text-primary-foreground" />
                                        </motion.span>
                                    )}
                                    <Icon className="w-6 h-6" />
                                    <span className="text-sm font-medium text-center leading-tight">{hobby.name}</span>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
                {errors.selectedHobbies && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-medium text-destructive mt-2"
                    >
                        {errors.selectedHobbies.message}
                    </motion.p>
                )}
            </motion.section>

            <div className="border-t border-border/40" />

            <motion.section
                custom={2}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
            >
                <h3 className="text-sm font-semibold text-foreground mb-4">
                    {t('auth.profile_form.chat_preferences_title')}
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="conversationType">{t('auth.profile_form.conversation_type_label')}</Label>
                        <Controller
                            name="conversationType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="h-11">
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
                        {errors.conversationType && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs font-medium text-destructive"
                            >
                                {errors.conversationType.message}
                            </motion.p>
                        )}
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
                                    className="min-h-[80px]"
                                    maxLength={200}
                                />
                            )}
                        />
                        <div className="flex justify-between items-center">
                            {errors.bio && (
                                <p className="text-xs font-medium text-destructive">{errors.bio.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground ml-auto transition-colors duration-200">
                                {t('auth.profile_form.bio_char_count', { count: bio.length })}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3"
                    >
                        <p className="text-sm font-medium text-destructive text-center">
                            {t(error)}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-end gap-3 border-t border-border/40 pt-5">
                <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="min-w-[140px] h-11 cursor-pointer"
                >
                    {isSubmitting ? t('auth.profile_form.submit_loading') : t('auth.profile_form.submit')}
                </Button>
            </div>
        </form>
    );
}
