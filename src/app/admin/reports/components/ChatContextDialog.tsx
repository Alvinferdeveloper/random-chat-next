'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/src/components/ui/dialog';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Badge } from '@/src/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { MessageSquare, Clock, Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { DetailedReport } from '../hooks/useAdminReports';
import { Message, isTextMessage, isImageMessage } from '@/src/types/chat';

const REASON_LABELS: Record<string, string> = {
    SPAM: 'Spam',
    HARASSMENT: 'Acoso',
    INAPPROPRIATE_CONTENT: 'Contenido NSFW',
    HATE_SPEECH: 'Odio',
    ANNOYING_BEHAVIOR: 'Molesto',
    OTHER: 'Otro'
};

interface ChatContextDialogProps {
    isOpen: boolean;
    onClose: () => void;
    reports: DetailedReport[];
    reportedUsername: string;
}

export function ChatContextDialog({ isOpen, onClose, reports, reportedUsername }: ChatContextDialogProps) {
    const reportsWithContext = reports.filter(r => r.chatContext && r.chatContext.length > 0);

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden flex flex-col h-[85vh]">
                <DialogHeader className="p-6 bg-muted/30 border-b shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        Evidencias de Chat: @{reportedUsername}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        {reportsWithContext.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-muted-foreground py-20 px-6 text-center">
                                <Clock className="h-12 w-12 opacity-20 mb-4" />
                                <h3 className="font-semibold text-lg">Sin evidencia disponible</h3>
                                <p className="text-sm max-w-xs mx-auto mt-1">
                                    No se capturó el historial de chat para ninguna de las denuncias pendientes de este usuario.
                                </p>
                            </div>
                        ) : (
                            <div className="p-6 space-y-12">
                                {reportsWithContext.map((report, rIdx) => (
                                    <div key={report.id} className="relative">
                                        {/* Divider and Header for each Report */}
                                        <div className="sticky top-0 z-10 py-3 bg-background/95 backdrop-blur-sm border-b mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-xs">
                                                    {rIdx + 1}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold">Reporte de @{report.reporter.username}</span>
                                                        <Badge variant="destructive" className="h-5 text-[10px]">
                                                            {REASON_LABELS[report.reason] || report.reason}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(report.createdAt).toLocaleString()}
                                                        </span>
                                                        {report.room && (
                                                            <span className="flex items-center gap-1">
                                                                <MessageSquare className="w-3 h-3" />
                                                                Sala: {report.room.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Messages for this specific report */}
                                        <div className="space-y-4 pl-4 border-l-2 border-muted ml-4">
                                            {report.chatContext?.map((msg: Message, mIdx: number) => {
                                                const isReportedUser = msg.username === reportedUsername;
                                                return (
                                                    <div key={msg.id || mIdx} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                                        <Avatar className="h-7 w-7 shrink-0">
                                                            <AvatarImage src={msg.userProfileImage || ''} />
                                                            <AvatarFallback className="text-[10px]">{msg.username?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "text-xs font-bold truncate",
                                                                    isReportedUser ? "text-destructive" : "text-primary"
                                                                )}>
                                                                    {msg.username}
                                                                </span>
                                                                <span className="text-[9px] text-muted-foreground">
                                                                    {formatTime(msg.timestamp)}
                                                                </span>
                                                            </div>
                                                            <div className={cn(
                                                                "p-3 rounded-2xl text-xs leading-relaxed",
                                                                isReportedUser 
                                                                    ? "bg-destructive/10 border border-destructive/20 text-foreground" 
                                                                    : "bg-muted text-muted-foreground"
                                                            )}>
                                                                {isTextMessage(msg) && msg.message}
                                                                {isImageMessage(msg) && (
                                                                    <img 
                                                                        src={msg.imageUrl} 
                                                                        className="mt-2 rounded-lg max-h-40 w-auto object-contain border bg-background" 
                                                                        alt="Imagen capturada" 
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {report.details && (
                                            <div className="mt-4 ml-8 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 italic text-xs text-muted-foreground">
                                                <span className="font-bold text-amber-600 not-italic block mb-1 uppercase text-[9px]">Comentario del denunciante:</span>
                                                "{report.details}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="p-4 bg-muted/30 border-t flex justify-between items-center shrink-0">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                        Total de evidencias: {reportsWithContext.length}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px] bg-background">
                        Sistema de Protección ChatHub
                    </Badge>
                </div>
            </DialogContent>
        </Dialog>
    );
}
