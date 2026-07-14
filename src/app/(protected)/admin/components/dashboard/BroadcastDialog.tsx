'use client';

import { Megaphone, Send, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/src/components/ui/dialog';
import { Textarea } from '@/src/components/ui/textarea';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function BroadcastDialog({
    open,
    onOpenChange,
    onSend,
    isSubmitting,
    error,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSend: (message: string) => void;
    isSubmitting: boolean;
    error: string | null;
}) {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-primary" />
                        {t('admin.broadcast.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('admin.broadcast.description')}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2 space-y-3">
                    {error && (
                        <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg">
                            {error}
                        </div>
                    )}
                    <Textarea
                        placeholder={t('admin.broadcast.placeholder')}
                        className="min-h-[120px] resize-none rounded-xl"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="rounded-xl active:scale-[0.95] transition-transform duration-100">
                        {t('admin.broadcast.cancel')}
                    </Button>
                    <Button onClick={handleSend} disabled={isSubmitting || !message.trim()} className="gap-2 rounded-xl active:scale-[0.95] transition-transform duration-100">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {t('admin.broadcast.send')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
