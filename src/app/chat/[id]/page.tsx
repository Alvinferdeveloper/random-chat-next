"use client"
import { useChat } from "@/src/app/hooks/useChat";
import { ChatHeader } from "@/src/app/chat/[id]/components/ChatHeader";
import { MessageList } from "@/src/app/chat/[id]/components/MessageList";
import { MessageInput } from "@/src/app/chat/[id]/components/MessageInput";
import { ChatConnecting } from "@/src/app/chat/[id]/components/ChatConnecting";

export default function ChatPage() {
    const {
        roomId,
        messages,
        newMessage,
        username,
        connecting,
        messagesEndRef,
        setNewMessage,
        handleSendMessage,
        handleImageSend,
    } = useChat();

    if (connecting) {
        return <ChatConnecting roomId={roomId} />;
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            <ChatHeader roomId={roomId} />
            <div className="relative flex flex-1 overflow-hidden">
                <MessageList
                    messages={messages}
                    username={username}
                    messagesEndRef={messagesEndRef}
                />
            </div>
            <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                handleImageSend={handleImageSend}
            />
        </div>
    );
}