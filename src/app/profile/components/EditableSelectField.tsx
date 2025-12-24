'use client';

import { useState } from 'react';
import { useForm, Controller, FieldValues, Path } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import { Label } from '@/src/components/ui/label';

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
}

export function EditableSelectField<T extends FieldValues, Name extends Path<T> = Path<T>>({
    name,
    label,
    value,
    updateFn,
    options,
    placeholder = '',
}: EditableSelectFieldProps<T, Name>) {
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
        <div className="flex items-start justify-between border-b border-border/50 py-4">
            <div>
                <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
                {!isEditing ? (
                    <p className="mt-1 text-base">{displayValue || <span className="text-muted-foreground italic">No establecido</span>}</p>
                ) : (
                    <form onSubmit={handleSubmit(onSave)} className="mt-2 w-full">
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
                                Guardar
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={handleCancel}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                        </div>
                    </form>
                )}
            </div>
            {!isEditing && (
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
            )}
        </div>
    );
}