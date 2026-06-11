'use client';

import { useAdminReports } from '@/src/app/admin/hooks/useAdminReports';
import { useAdminUsers } from '@/src/app/admin/hooks/useAdminUsers';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { 
    AlertCircle, 
    ShieldAlert, 
    UserX, 
    CheckCircle2, 
    XCircle,
    Loader2,
    Calendar,
    MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { BanDialog } from '@/src/app/admin/users/components/BanDialog';

const REASON_LABELS: Record<string, string> = {
    SPAM: 'Spam',
    HARASSMENT: 'Acoso',
    INAPPROPRIATE_CONTENT: 'Contenido NSFW',
    HATE_SPEECH: 'Odio',
    ANNOYING_BEHAVIOR: 'Molesto',
    OTHER: 'Otro'
};

export default function AdminReportsPage() {
    const { 
        offenders, 
        loading, 
        resolveReports, 
        refresh: refreshReports 
    } = useAdminReports();
    
    const { toggleBan } = useAdminUsers();

    const [processingId, setProcessingId] = useState<string | null>(null);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [userToBan, setUserToBan] = useState<{ id: string, username: string } | null>(null);

    const handleResolve = async (userId: string, status: 'RESOLVED' | 'DISMISSED') => {
        setProcessingId(userId);
        await resolveReports(userId, status);
        setProcessingId(null);
    };

    const handleBanClick = (user: any) => {
        setUserToBan({ id: user.id, username: user.username });
        setBanDialogOpen(true);
    };

    const handleConfirmBan = async (reason: string) => {
        if (!userToBan) return;
        setProcessingId(userToBan.id);
        const success = await toggleBan(userToBan.id, true, reason);
        if (success) {
            // After banning, mark reports as resolved
            await resolveReports(userToBan.id, 'RESOLVED');
        }
        setProcessingId(null);
        setBanDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Reportes de Comunidad</h1>
                <Badge variant="outline" className="px-3 py-1">
                    Priorizando reincidentes
                </Badge>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Analizando reportes...</p>
                </div>
            ) : offenders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold">¡Todo despejado!</h3>
                    <p className="text-muted-foreground text-sm">No hay reportes pendientes de resolución.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {offenders.map((offender) => (
                        <Card key={offender.user.id} className="overflow-hidden border-2 border-destructive/10">
                            <CardHeader className="bg-muted/30 p-4 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={offender.user.image || ''} />
                                            <AvatarFallback>{offender.user.username?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold flex items-center gap-2">
                                                {offender.user.username}
                                                <Badge variant="destructive" className="h-5">
                                                    {offender.reportCount} reportes
                                                </Badge>
                                            </h3>
                                            <p className="text-xs text-muted-foreground">{offender.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8 gap-1.5"
                                            onClick={() => handleResolve(offender.user.id, 'DISMISSED')}
                                            disabled={processingId === offender.user.id}
                                        >
                                            <XCircle className="w-3.5 h-3.5" />
                                            Descartar
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="h-8 gap-1.5"
                                            onClick={() => handleBanClick(offender.user)}
                                            disabled={processingId === offender.user.id}
                                        >
                                            {processingId === offender.user.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <UserX className="w-3.5 h-3.5" />
                                            )}
                                            Banear Usuario
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="p-4 bg-background">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5 w-full mb-1">
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                            Motivos Recientes:
                                        </span>
                                        {offender.recentReasons.map((reason, i) => (
                                            <Badge key={i} variant="secondary" className="bg-secondary/50">
                                                {REASON_LABELS[reason] || reason}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Último reporte: {new Date(offender.lastReportedAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <BanDialog
                isOpen={banDialogOpen}
                onClose={() => setBanDialogOpen(false)}
                onConfirm={handleConfirmBan}
                username={userToBan?.username || ''}
            />
        </div>
    );
}
