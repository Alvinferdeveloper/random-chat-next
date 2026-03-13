import { ClientChatLayout } from './components/ClientChatLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Chat",
    description: "Conéctate en tiempo real y comparte momentos en esta sala de chat.",
    robots: {
        index: false,
        follow: false,
    }
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClientChatLayout>
            {children}
        </ClientChatLayout>
    );
}