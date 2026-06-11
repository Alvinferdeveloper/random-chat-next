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
    AlertCircle, 
    MessageSquare, 
    ShieldAlert, 
    Zap, 
    Skull, 
    HelpCircle 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useReportUser, ReportReason } from '../hooks/useReportUser';

interface ReportOption {
    id: ReportReason;
    label: string;
    icon: any;
    description: string;
}

const REPORT_OPTIONS: ReportOption[] = [
    { id: 'SPAM', label: 'Spam o Publicidad', icon: MessageSquare, description: 'Bots, links sospechosos o mensajes repetitivos.' },
    { id: 'HARASSMENT', label: 'Acoso o Bullying', icon: ShieldAlert, description: 'Insultos personales o comportamiento hostil.' },
    { id: 'INAPPROPRIATE_CONTENT', label: 'Contenido Sexual', icon: Skull, description: 'Imágenes o lenguaje explícito no deseado.' },
    { id: 'HATE_SPEECH', label: 'Discurso de Odio', icon: ShieldAlert, description: 'Racismo, homofobia o discriminación.' },
    { id: 'ANNOYING_BEHAVIOR', label: 'Comportamiento Molesto', icon: Zap, description: 'Interrupción constante o flood.' },
    { id: 'OTHER', label: 'Otro motivo', icon: HelpCircle, description: 'Cualquier otra razón no listada.' },
];

interface ReportUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    reportedUsername: string;
    reportedUserId: string;
    roomId?: string;
}

export function ReportUserDialog({ isOpen, onClose, reportedUsername, reportedUserId, roomId }: ReportUserDialogProps) {
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

    // Reset hook state when dialog opens
    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl">
                {isSuccess ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                            <ShieldAlert className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">Reporte Enviado</h3>
                        <p className="text-muted-foreground px-8 mt-2">
                            Gracias por ayudarnos a mantener <strong>ChatHub</strong> seguro. Revisaremos tu reporte pronto.
                        </p>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="p-6 bg-secondary/30">
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                Reportar a {reportedUsername}
                            </DialogTitle>
                            <DialogDescription>
                                Selecciona el motivo que mejor describa el comportamiento del usuario.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium animate-in fade-in duration-200">
                                    {error}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 gap-2">
                                {REPORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedReason(option.id)}
                                        className={cn(
                                            "flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-primary/50",
                                            selectedReason === option.id 
                                                ? "border-primary bg-primary/5 ring-1 ring-primary" 
                                                : "border-transparent bg-muted/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-0.5 p-2 rounded-lg",
                                            selectedReason === option.id ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                                        )}>
                                            <option.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{option.label}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{option.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {selectedReason === 'OTHER' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-sm font-semibold ml-1">Cuéntanos más:</label>
                                    <Textarea
                                        placeholder="Describe brevemente el problema..."
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        className="min-h-[100px] rounded-xl bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                        maxLength={255}
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter className="p-6 pt-2 flex items-center justify-between border-t bg-secondary/10">
                            <Button 
                                variant="ghost" 
                                onClick={onClose} 
                                disabled={isSubmitting}
                                className="rounded-xl"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={submitReport} 
                                disabled={!selectedReason || isSubmitting}
                                className="px-8 rounded-xl font-bold"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar Reporte'
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
