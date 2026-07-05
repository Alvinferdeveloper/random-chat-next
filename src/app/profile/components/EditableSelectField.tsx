'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller, FieldValues, Path } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import { Label } from '@/src/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface EditableSelectFieldProps<T extends FieldValues, Name extends Path<T> = Path<T>> {
    name: Name;
    label: string;
    value: string | undefined;
    updateFn: (field: Name, value: any) => Promise<void>;
    options: Option[];
    placeholder?: string;
    readOnly?: boolean;
}

export function EditableSelectField<T extends FieldValues, Name extends Path<T> = Path<T>>({
    name,
    label,
    value,
    updateFn,
    options,
    placeholder = '',
    readOnly = false,
}: EditableSelectFieldProps<T, Name>) {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { [name]: value }
    });

    const onSave = async (data: FieldValues) => {
        setIsSaving(true);
        await updateFn(name, data[name]);
        setIsSaving(false);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const displayValue = options.find(option => option.value === value)?.label || placeholder;

    return (
        <motion.div layout className="flex items-start justify-between border-b border-border/50 py-4">
            <div className="flex-1">
                <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        <motion.p
                            key="view"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="mt-1 text-base"
                        >
                            {displayValue || <span className="text-muted-foreground italic">{t('profile.editable.not_set')}</span>}
                        </motion.p>
                    ) : (
                        <motion.form
                            key="edit"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleSubmit(onSave)}
                            className="mt-2 w-full overflow-hidden"
                        >
                            <Controller
                                name={name}
                                control={control}
                                defaultValue={value as any}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full md:w-[250px]">
                                            <SelectValue placeholder={placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {options.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors[name] && <p className="mt-1 text-xs text-red-500">{(errors[name] as any).message}</p>}
                            <div className="mt-3 flex gap-2">
                                <Button type="submit" size="sm" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    {t('profile.editable.save')}
                                </Button>
                                <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
                                    <X className="mr-2 h-4 w-4" />
                                    {t('profile.editable.cancel')}
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
            {!isEditing && !readOnly && (
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
            )}
        </motion.div>
    );
}
