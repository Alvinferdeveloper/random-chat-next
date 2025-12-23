'use client';

import { useState } from 'react';
import { useForm, Controller, FieldValues, Path } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import { Label } from '@/src/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

interface EditableFieldProps<T extends FieldValues, Name extends Path<T> = Path<T>> {
    name: Name;
    label: string;
    value: string | undefined;
    control: any;
    updateFn: (field: Name, value: any) => Promise<void>;
    isTextarea?: boolean;
    placeholder?: string;
    maxLength?: number;
    inputClassName?: string;
    labelClassName?: string;
}

export function EditableField<T extends FieldValues, Name extends Path<T> = Path<T>>({
    name, label, value, control, updateFn, isTextarea = false,
    placeholder = '', maxLength, inputClassName = '', labelClassName = '',
}: EditableFieldProps<T, Name>) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { handleSubmit, formState: { errors } } = useForm({
        defaultValues: { [name]: value }
    });

    const onSave = async (data: FieldValues) => {
        setIsSaving(true);
        await updateFn(name, data[name]);
        setIsSaving(false);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            className={`group relative flex w-full items-start justify-between border-b border-border/40 py-5 transition-colors ${isEditing ? 'bg-primary/5 px-2 -mx-2 rounded-lg border-transparent' : ''}`}
        >
            <div className="w-full">
                <Label className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 ${labelClassName}`}>
                    {label}
                </Label>

                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="flex items-center justify-between"
                        >
                            <p className={`mt-1.5 text-base leading-relaxed ${inputClassName}`}>
                                {value || <span className="text-muted-foreground/50 italic">No establecido</span>}
                            </p>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="edit"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleSubmit(onSave)}
                            className="mt-3 w-full overflow-hidden"
                        >
                            <Controller
                                name={name}
                                control={control}
                                defaultValue={value as any}
                                render={({ field }) => (
                                    isTextarea ? (
                                        <Textarea
                                            {...field}
                                            className={`min-h-[100px] resize-none focus-visible:ring-primary ${inputClassName}`}
                                            placeholder={placeholder}
                                            maxLength={maxLength}
                                        />
                                    ) : (
                                        <Input
                                            {...field}
                                            className={`h-11 focus-visible:ring-primary ${inputClassName}`}
                                            placeholder={placeholder}
                                            autoFocus
                                        />
                                    )
                                )}
                            />
                            {errors[name] && <p className="mt-1.5 text-xs font-medium text-destructive">{(errors[name] as any).message}</p>}

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 flex gap-2"
                            >
                                <Button type="submit" size="sm" className="rounded-full px-4" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Guardar
                                </Button>
                                <Button type="button" size="sm" variant="ghost" className="rounded-full px-4" onClick={() => setIsEditing(false)}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                            </motion.div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}