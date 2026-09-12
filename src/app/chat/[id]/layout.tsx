import { ClientChatLayout } from './components/ClientChatLayout';
import { Metadata } from 'next';
import { APP_NAME } from '@/src/app/constants';

async function fetchRoomName(roomId: string): Promise<string | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/rooms/${roomId}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data?.name ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id: roomId } = await params;
    const roomName = await fetchRoomName(roomId);

    return {
        title: roomName || 'Chat',
        description: roomName
            ? `Únete a "${roomName}" en ${APP_NAME} y conecta con personas en tiempo real.`
            : `Únete a esta tribu en ${APP_NAME} y conecta con personas en tiempo real.`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClientChatLayout>
            {children}
        </ClientChatLayout>
    );
}
