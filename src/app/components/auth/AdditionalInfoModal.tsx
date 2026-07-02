'use client';

import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto gap-0 p-0">
                <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-b from-primary/[0.08] to-transparent px-6 pt-8 pb-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/[0.06] rounded-full blur-2xl" />

                    <DialogHeader className="text-center space-y-1.5 relative">
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            {t('auth.additional_info.title')}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground max-w-sm mx-auto">
                            {t('auth.additional_info.description')}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="px-6 py-5">
                    <FormProvider {...form}>
                        <ProfileForm
                            hobbies={hobbies}
                            hobbiesLoading={hobbiesLoading}
                            onSubmit={handleFormSubmit}
                            error={error}
                        />
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
}
