'use client';

import { useAdminUsers } from './hooks/useAdminUsers';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { 
    Search, 
    UserX, 
    UserCheck, 
    Loader2, 
    Mail,
    Calendar,
    Shield,
    Eye
} from 'lucide-react';
import { useState } from 'react';
import { BanDialog } from './components/BanDialog';
import { UserDetailSheet } from './components/UserDetailSheet';
import { Pagination } from '@/src/app/components/shared/Pagination';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from '@/src/app/hooks/useAuth';

export default function AdminUsersPage() {
    const { 
        users, 
        pagination,
        loading, 
        search, 
        setSearch,
        page,
        setPage, 
        toggleBan,
        changeRole
    } = useAdminUsers();

    const { session } = useAuth();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [userToBan, setUserToBan] = useState<{ id: string, username: string } | null>(null);
    const [detailUserId, setDetailUserId] = useState<string | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const handleActionClick = async (user: any) => {
        if (user.isBanned) {
            setProcessingId(user.id);
            const success = await toggleBan(user.id, false);
            if (success) toast.success(`Usuario @${user.username} desbaneado.`);
            setProcessingId(null);
        } else {
            setUserToBan({ id: user.id, username: user.username });
            setBanDialogOpen(true);
        }
    };

    const handleConfirmBan = async (reason: string) => {
        if (!userToBan) return;
        setProcessingId(userToBan.id);
        const success = await toggleBan(userToBan.id, true, reason);
        if (success) toast.success(`Usuario @${userToBan.username} baneado.`);
        setProcessingId(null);
        setBanDialogOpen(false);
    };

    const handleChangeRole = async (userId: string, username: string, newRole: string) => {
        setProcessingId(userId);
        const success = await changeRole(userId, newRole);
        if (success) toast.success(`Rol de @${username} actualizado a ${newRole}.`);
        setProcessingId(null);
    };

    const isMe = (userId: string) => session?.user?.id === userId;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, email o username..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">No se encontraron usuarios.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {users.map((user) => (
                                <div 
                                    key={user.id} 
                                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-secondary/20 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={user.image || ''} />
                                            <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{user.username}</h3>
                                                {user.role === 'ADMIN' && (
                                                    <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 border-amber-500/20">Admin</Badge>
                                                )}
                                                {user.role === 'MODERATOR' && (
                                                    <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-600 border-blue-500/20">Moderador</Badge>
                                                )}
                                                {user.isBanned && (
                                                    <Badge variant="destructive" className="text-[10px] uppercase font-bold">Baneado</Badge>
                                                )}
                                                {isMe(user.id) && (
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold italic">Tú</Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {user.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Unido: {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 h-8"
                                            onClick={() => { setDetailUserId(user.id); setDetailOpen(true); }}
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Ver
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="gap-2 h-8"
                                                    disabled={processingId === user.id || isMe(user.id)}
                                                >
                                                    <Shield className="w-3.5 h-3.5" />
                                                    Rol
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem onClick={() => handleChangeRole(user.id, user.username, 'USER')} className="text-xs font-medium">
                                                    Usuario (USER)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeRole(user.id, user.username, 'MODERATOR')} className="text-xs font-medium text-blue-600">
                                                    Moderador (MOD)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleChangeRole(user.id, user.username, 'ADMIN')} className="text-xs font-medium text-amber-600">
                                                    Administrador (ADMIN)
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Button
                                            variant={user.isBanned ? "outline" : "destructive"}
                                            size="sm"
                                            className="gap-2 h-8"
                                            disabled={processingId === user.id || user.role === 'ADMIN'}
                                            onClick={() => handleActionClick(user)}
                                        >
                                            {processingId === user.id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : user.isBanned ? (
                                                <UserCheck className="h-3.5 w-3.5" />
                                            ) : (
                                                <UserX className="h-3.5 w-3.5" />
                                            )}
                                            {user.isBanned ? 'Desbanear' : 'Banear'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                {pagination && pagination.totalPages > 1 && (
                    <div className="border-t p-4">
                        <Pagination 
                            currentPage={page}
                            totalPages={pagination.totalPages}
                            onPageChange={setPage}
                            isLoading={loading}
                        />
                    </div>
                )}
            </Card>

            <UserDetailSheet
                userId={detailUserId}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
            <BanDialog
                isOpen={banDialogOpen}
                onClose={() => setBanDialogOpen(false)}
                onConfirm={handleConfirmBan}
                username={userToBan?.username || ''}
            />
        </div>
    );
}
