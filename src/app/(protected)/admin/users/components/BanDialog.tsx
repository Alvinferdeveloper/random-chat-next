'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Trans } from 'react-i18next';

interface BanDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    username: string;
}

export function BanDialog({ isOpen, onClose, onConfirm, username }: BanDialogProps) {
    const { t } = useTranslation();
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm(reason);
            setReason('');
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        {t('admin.ban_dialog.title')}
                    </DialogTitle>
                    <DialogDescription>
                        <Trans t={t} i18nKey="admin.ban_dialog.description" values={{ username }} components={{ strong: <strong /> }} />
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <label className="text-sm font-medium mb-2 block">
                        {t('admin.ban_dialog.reason_label')}
                    </label>
                    <Textarea
                        placeholder={t('admin.ban_dialog.reason_placeholder')}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={isSubmitting}
                        className="resize-none"
                        rows={3}
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="active:scale-[0.98] cursor-pointer">
                        {t('admin.ban_dialog.cancel')}
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleConfirm} 
                        disabled={isSubmitting}
                        className="active:scale-[0.98] cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('admin.ban_dialog.banning')}
                            </>
                        ) : (
                            t('admin.ban_dialog.confirm')
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
