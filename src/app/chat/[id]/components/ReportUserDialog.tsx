'use client';

import { useEffect } from 'react';
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
import {
    Loader2,
    MessageSquare,
    ShieldAlert,
    EyeOff,
    Flag,
    Zap,
    HelpCircle,
    ShieldCheck,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useReportUser, ReportReason } from '../hooks/useReportUser';
import { useTranslation } from 'react-i18next';

interface ReportOption {
    id: ReportReason;
    label: string;
    icon: any;
    description: string;
}

const REASON_KEY_MAP: Record<string, string> = {
    SPAM: 'spam',
    HARASSMENT: 'harassment',
    INAPPROPRIATE_CONTENT: 'inappropriate',
    HATE_SPEECH: 'hate_speech',
    ANNOYING_BEHAVIOR: 'annoying',
    OTHER: 'other',
};

const REPORT_OPTIONS: ReportOption[] = [
    { id: 'SPAM', label: 'Spam o Publicidad', icon: MessageSquare, description: 'Bots, links sospechosos o mensajes repetitivos.' },
    { id: 'HARASSMENT', label: 'Acoso o Bullying', icon: ShieldAlert, description: 'Insultos personales o comportamiento hostil.' },
    { id: 'INAPPROPRIATE_CONTENT', label: 'Contenido Sexual', icon: EyeOff, description: 'Imágenes o lenguaje explícito no deseado.' },
    { id: 'HATE_SPEECH', label: 'Discurso de Odio', icon: Flag, description: 'Racismo, homofobia o discriminación.' },
    { id: 'ANNOYING_BEHAVIOR', label: 'Comportamiento Molesto', icon: Zap, description: 'Interrupción constante o flood.' },
    { id: 'OTHER', label: 'Otro motivo', icon: HelpCircle, description: 'Cualquier otra razón no listada.' },
];

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

interface ReportUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    reportedUsername: string;
    reportedUserId: string;
    roomId?: string;
}

export function ReportUserDialog({ isOpen, onClose, reportedUsername, reportedUserId, roomId }: ReportUserDialogProps) {
    const { t } = useTranslation();
    const {
        selectedReason,
        setSelectedReason,
        details,
        setDetails,
        isSubmitting,
        isSuccess,
        error,
        submitReport,
        reset
    } = useReportUser({
        reportedUserId,
        roomId,
        onSuccess: () => {
            setTimeout(() => {
                onClose();
                setTimeout(reset, 300);
            }, 2000);
        }
    });

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl gap-0">
                {isSuccess ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center px-8">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5">
                            <ShieldCheck className="w-7 h-7 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">{t('chat.report.success_title')}</h3>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-sm">
                            {t('chat.report.success_desc')}
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="p-5 pb-0">
                            <DialogTitle className="text-base font-semibold tracking-tight">
                                {t('chat.report.title', { username: reportedUsername })}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground/80">
                                {t('chat.report.description')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {error && (
                                <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium animate-in fade-in duration-200">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-1.5">
                                {REPORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedReason(option.id)}
                                        className={cn(
                                            "flex items-center gap-3.5 w-full p-3 rounded-xl text-left transition-all duration-200",
                                            "active:scale-[0.98]",
                                            selectedReason === option.id
                                                ? "bg-primary/8 text-foreground ring-1 ring-primary/30"
                                                : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                        )}
                                        style={{ transitionTimingFunction: EASE_OUT }}
                                    >
                                        <div className={cn(
                                            "p-1.5 rounded-lg transition-colors duration-200",
                                            selectedReason === option.id ? "bg-primary text-primary-foreground" : "bg-muted-foreground/10"
                                        )}>
                                            <option.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold">{t(`chat.report.reason.${REASON_KEY_MAP[option.id]}`)}</p>
                                            <p className="text-xs text-muted-foreground/70 mt-px leading-relaxed">{t(`chat.report.reason.${REASON_KEY_MAP[option.id]}_desc`)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {selectedReason === 'OTHER' && (
                                <div className="pt-1 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-xs font-semibold text-muted-foreground ml-1">{t('chat.report.other_label')}</label>
                                    <Textarea
                                        placeholder={t('chat.report.other_placeholder')}
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        className="min-h-[90px] rounded-xl bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary text-sm"
                                        maxLength={255}
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-5 pt-3 flex items-center justify-between border-t border-white/[0.04]">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="rounded-xl cursor-pointer text-sm active:scale-[0.97]"
                                style={{ transitionTimingFunction: EASE_OUT }}
                            >
                                {t('chat.report.cancel')}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={submitReport}
                                disabled={!selectedReason || isSubmitting}
                                className="rounded-xl cursor-pointer text-sm font-semibold active:scale-[0.97] px-5"
                                style={{ transitionTimingFunction: EASE_OUT }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t('chat.report.sending')}
                                    </>
                                ) : (
                                    t('chat.report.send')
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
