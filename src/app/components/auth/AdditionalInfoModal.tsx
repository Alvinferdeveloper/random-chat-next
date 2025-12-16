'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/src/components/ui/dialog';
import { useProfileSetup } from '@/src/app/hooks/useProfileSetup';
import { ProfileForm } from './form/ProfileForm';
import { ProfileFormValues } from '@/src/lib/validators/user';

interface AdditionalInfoModalProps {
    isOpen: boolean;
    onProfileComplete: () => void;
    onClose?: () => void;
}

export function AdditionalInfoModal({ isOpen, onProfileComplete, onClose }: AdditionalInfoModalProps) {
    const { form, hobbies, hobbiesLoading, error, handleSubmit } = useProfileSetup();

    const handleFormSubmit = (values: ProfileFormValues) => {
        handleSubmit(values, onProfileComplete);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && onClose) {
            onClose();
        }
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

                <FormProvider {...form}>
                    <ProfileForm
                        hobbies={hobbies}
                        hobbiesLoading={hobbiesLoading}
                        onSubmit={handleFormSubmit}
                        error={error}
                    />
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

