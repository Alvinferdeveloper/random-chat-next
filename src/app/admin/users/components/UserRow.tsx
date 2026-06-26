'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Mail, Calendar, Eye, Shield, UserX, UserCheck, Loader2 } from 'lucide-react';
import { User } from '../hooks/useAdminUsers';

interface UserRowProps {
    user: User;
    index: number;
    isMe: boolean;
    processingId: string | null;
    onView: (userId: string) => void;
    onChangeRole: (userId: string, username: string, role: string) => void;
    onAction: (user: User) => void;
}

export default function UserRow({ user, index, isMe, processingId, onView, onChangeRole, onAction }: UserRowProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1], delay: index * 0.03 }}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/30 transition-colors active:scale-[0.99] group"
        >
            <div className="flex items-center gap-4 min-w-0">
                <Avatar className="h-11 w-11 border shrink-0">
                    <AvatarImage src={user.image || ''} />
                    <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm truncate">{user.username}</h3>
                        {user.role === 'ADMIN' && (
                            <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-600 border-amber-500/20">{t('admin.users.role.admin')}</Badge>
                        )}
                        {user.role === 'MODERATOR' && (
                            <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-600 border-blue-500/20">{t('admin.users.role.mod')}</Badge>
                        )}
                        {user.isBanned && (
                            <Badge variant="destructive" className="text-[10px] uppercase font-bold">{t('admin.users.role.banned')}</Badge>
                        )}
                        {isMe && (
                            <Badge variant="outline" className="text-[10px] uppercase font-bold italic">{t('admin.users.role.you')}</Badge>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 shrink-0" />
                            {t('admin.users.joined')} {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 h-8 text-xs active:scale-[0.98] cursor-pointer"
                    onClick={() => onView(user.id)}
                >
                    <Eye className="w-3.5 h-3.5" />
                    {t('admin.users.view')}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 h-8 text-xs active:scale-[0.98] cursor-pointer"
                            disabled={processingId === user.id || isMe}
                        >
                            <Shield className="w-3.5 h-3.5" />
                            {t('admin.users.role_btn')}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onChangeRole(user.id, user.username, 'USER')} className="text-xs font-medium">
                            {t('admin.users.role.user_label')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onChangeRole(user.id, user.username, 'MODERATOR')} className="text-xs font-medium text-blue-600">
                            {t('admin.users.role.mod_label')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onChangeRole(user.id, user.username, 'ADMIN')} className="text-xs font-medium text-amber-600">
                            {t('admin.users.role.admin_label')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant={user.isBanned ? "outline" : "destructive"}
                    size="sm"
                    className="gap-1.5 h-8 text-xs active:scale-[0.98] cursor-pointer"
                    disabled={processingId === user.id || user.role === 'ADMIN'}
                    onClick={() => onAction(user)}
                >
                    {processingId === user.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : user.isBanned ? (
                        <UserCheck className="h-3.5 w-3.5" />
                    ) : (
                        <UserX className="h-3.5 w-3.5" />
                    )}
                    {user.isBanned ? t('admin.users.unban') : t('admin.users.ban')}
                </Button>
            </div>
        </motion.div>
    );
}
