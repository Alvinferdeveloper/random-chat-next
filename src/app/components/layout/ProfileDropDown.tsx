'use client';

import { useEffect, useState } from 'react';
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
import { useCachedOnMount } from '@/src/app/hooks/useCachedOnMount';
import { setSessionCache } from '@/src/app/utils/sessionCache';

// Purely cosmetic cache of "who was logged in last" so the navbar can show
// the avatar (or login button) instantly on a remount instead of the loading
// pulse, while the real session request resolves in the background. This
// never feeds into any auth/access-control decision - it's display-only.
type CachedDisplayUser = { name: string; email: string; image?: string | null } | null;
const DISPLAY_CACHE_KEY = 'user_nav_display_cache';
const DISPLAY_CACHE_TTL_MS = 10 * 60 * 1000;

export function UserNav() {
    const { session, isPending } = useAuth();
    const socket = useSocket();
    const navigation = useRouter()
    const { removeStoredUsername } = useUsername();
    const { t } = useTranslation();
    const [cachedUser, setCachedUser] = useState<CachedDisplayUser>();
    const [hasCache, setHasCache] = useState(false);

    useCachedOnMount<CachedDisplayUser>(DISPLAY_CACHE_KEY, DISPLAY_CACHE_TTL_MS, (cached) => {
        setCachedUser(cached);
        setHasCache(true);
    });

    useEffect(() => {
        if (isPending) return;
        setSessionCache<CachedDisplayUser>(DISPLAY_CACHE_KEY, session?.user ? {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
        } : null);
    }, [isPending, session?.user?.id, session?.user?.name, session?.user?.email, session?.user?.image]);

    const handleLogout = async () => {
        removeStoredUsername();
        await authClient.signOut();
        if (socket) {
            socket.disconnect();
            socket.connect();
        }
    };

    if (isPending) {
        if (!hasCache) {
            return <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>;
        }
        if (!cachedUser) {
            return (
                <a href="/login" title={t('layout.profile_dropdown.login_title')}>
                    <Button size="sm" className="flex items-center justify-center gap-2 cursor-pointer h-9 w-9 p-0 md:w-auto md:px-4 shrink-0 active:scale-95 transition-transform duration-150 ease-out">
                        <UserIcon className="w-4 h-4" />
                        <span className="hidden md:inline">{t('layout.profile_dropdown.login_title')}</span>
                    </Button>
                </a>
            );
        }
        const cachedInitials = cachedUser.name?.split(' ').map((n) => n[0]).join('').substring(0, 2);
        return (
            <Avatar className="h-9 w-9 opacity-80">
                <AvatarImage src={cachedUser.image ?? ''} alt={`@${cachedUser.name}`} />
                <AvatarFallback>{cachedInitials}</AvatarFallback>
            </Avatar>
        );
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
                    <DropdownMenuItem className='cursor-pointer transition-colors duration-150' onClick={() => navigation.push("/tribus/my-rooms")}>
                        <LayoutDashboard className="size-4" />
                        <span>{t('layout.profile_dropdown.my_rooms')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer transition-colors duration-150' onClick={() => navigation.push("/tribus/favorites")}>
                        <Heart className="size-4" />
                        <span>{t('layout.profile_dropdown.favorites')}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer transition-colors duration-150' onClick={() => navigation.push("/tribus/create")}>
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
