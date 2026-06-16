'use client';

import { useAdminReports, DetailedReport } from './hooks/useAdminReports';
import { useAdminUsers } from '../users/hooks/useAdminUsers';
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
    Eye,
    MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { BanDialog } from '@/src/app/admin/users/components/BanDialog';
import { Pagination } from '@/src/app/components/shared/Pagination';
import { ChatContextDialog } from './components/ChatContextDialog';
import { toast } from 'sonner';

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
        pagination,
        loading, 
        page,
        setPage,
        resolveReports,
        fetchUserReports 
    } = useAdminReports();
    
    const { toggleBan } = useAdminUsers();

    const [processingId, setProcessingId] = useState<string | null>(null);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [userToBan, setUserToBan] = useState<{ id: string, username: string } | null>(null);
    
    // Context Evidence State
    const [isContextOpen, setIsContextOpen] = useState(false);
    const [contextReports, setContextReports] = useState<DetailedReport[]>([]);
    const [selectedUsername, setSelectedUsername] = useState('');

    const handleResolve = async (userId: string, status: 'RESOLVED' | 'DISMISSED') => {
        setProcessingId(userId);
        const success = await resolveReports(userId, status);
        if (success) {
            toast.success(status === 'RESOLVED' ? 'Reportes resueltos.' : 'Reportes descartados.');
        }
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
            toast.success(`Usuario @${userToBan.username} baneado.`);
            await resolveReports(userToBan.id, 'RESOLVED');
        }
        setProcessingId(null);
        setBanDialogOpen(false);
    };

    const handleViewContext = async (user: any) => {
        setProcessingId(user.id);
        const reports = await fetchUserReports(user.id);
        
        if (reports.length > 0) {
            setContextReports(reports);
            setSelectedUsername(user.username);
            setIsContextOpen(true);
        } else {
            toast.info('No se encontró historial de chat para los reportes de este usuario.');
        }
        setProcessingId(null);
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
                                            onClick={() => handleViewContext(offender.user)}
                                            disabled={processingId === offender.user.id}
                                        >
                                            {processingId === offender.user.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                                            Ver Evidencia
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8 gap-1.5 text-muted-foreground"
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
                                            <UserX className="w-3.5 h-3.5" />
                                            Banear
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
                    
                    {pagination && pagination.totalPages > 1 && (
                        <Card className="p-2">
                            <Pagination 
                                currentPage={page}
                                totalPages={pagination.totalPages}
                                onPageChange={setPage}
                                isLoading={loading}
                            />
                        </Card>
                    )}
                </div>
            )}

            <BanDialog
                isOpen={banDialogOpen}
                onClose={() => setBanDialogOpen(false)}
                onConfirm={handleConfirmBan}
                username={userToBan?.username || ''}
            />

            <ChatContextDialog
                isOpen={isContextOpen}
                onClose={() => setIsContextOpen(false)}
                reports={contextReports}
                reportedUsername={selectedUsername}
            />
        </div>
    );
}
