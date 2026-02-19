'use client';

import { useUsername } from '@/src/app/hooks/useUsername';
import { ChatProvider } from '@/src/app/chat/[id]/components/ChatProvider';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const username = useUsername();
    return (
        <ChatProvider username={username}>
            {children}
        </ChatProvider>
    );
}
