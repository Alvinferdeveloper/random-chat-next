'use client';

import { authClient } from '@/src/app/lib/auth-client';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, Users, BadgePlus, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '@/src/app/hooks/useAuth';
import { useTranslation } from '@/src/app/lib/i18n';
import { useSocket } from '@/src/app/components/providers/SocketEventProvider';
import { useRouter } from 'next/navigation';
import { useUsername } from "@/src/app/hooks/useUsername";

export function UserNav() {
    const { session, isPending } = useAuth();
    const socket = useSocket();
    const navigation = useRouter()
    const { removeStoredUsername } = useUsername();
    const { t } = useTranslation();

    const handleLogout = async () => {
        removeStoredUsername();
        await authClient.signOut();
        if (socket) {
            socket.disconnect();
            socket.connect();
        }
    };

    if (isPending) {
        return <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>;
    }

    if (!session?.user) {
        return (
            <a href="/login" title={t('layout.profile_dropdown.login_title')}>
                <Button size="sm" className="flex items-center justify-center gap-2 cursor-pointer h-9 w-9 p-0 md:w-auto md:px-4 shrink-0 active:scale-95 transition-transform duration-150 ease-out">
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden md:inline">{t('layout.profile_dropdown.login_title')}</span>
                </Button>
            </a>
        );
    }

    const { user } = session;
    const initials = user.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200 active:scale-95">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image ?? ''} alt={`@${user.name}`} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 backdrop-blur-xl bg-background/95" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer transition-colors duration-150' onClick={() => navigation.push("/profile")}>
                        <UserIcon className="size-4" />
                        <span>{t('layout.profile_dropdown.profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer transition-colors duration-150' onClick={() => navigation.push("/rooms/my-rooms")}>
                        <LayoutDashboard className="size-4" />
                        <span>{t('layout.profile_dropdown.my_rooms')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer transition-colors duration-150' onClick={() => navigation.push("/rooms/favorites")}>
                        <Heart className="size-4" />
                        <span>{t('layout.profile_dropdown.favorites')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer transition-colors duration-150' onClick={() => navigation.push("/rooms/create")}>
                        <BadgePlus className="size-4" />
                        <span>{t('layout.profile_dropdown.create_room')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer transition-colors duration-150' variant="destructive" onClick={handleLogout}>
                    <LogOut className="size-4" />
                    <span>{t('layout.profile_dropdown.logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
