import { ClientChatLayout } from './components/ClientChatLayout';
import { Metadata } from 'next';
import { APP_NAME } from '@/src/app/constants';

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id: roomId } = await params;

    return {
        title: `Sala de Chat #${roomId}`,
        description: `Únete a esta sala de chat en ${APP_NAME} y conecta con personas en tiempo real.`,
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