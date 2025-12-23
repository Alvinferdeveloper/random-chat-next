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
import { LogOut, User as UserIcon, Users } from 'lucide-react';
import { useAuth } from '@/src/app/hooks/useAuth';
import { useSocket } from '@/src/app/components/providers/SocketProvider';
import { useRouter } from 'next/navigation';

export function UserNav() {
    const { session, isPending } = useAuth();
    const socket = useSocket();
    const navigation = useRouter()

    const handleLogout = async () => {
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
            <a href="/login">
                <Button size="sm" className="hidden md:flex gap-2 cursor-pointer">
                    <Users className="w-4 h-4" />
                    Iniciar sesión
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
                <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image ?? ''} alt={`@${user.name}`} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
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
                    <DropdownMenuItem onClick={() => navigation.push("/profile")}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
