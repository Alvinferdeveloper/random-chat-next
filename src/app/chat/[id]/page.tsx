"use client"
import { useChat } from "@/src/app/chat/[id]/hooks/useChat";
import { useImageViewer } from "@/src/app/chat/[id]/hooks/useImageViewer";
import { ChatHeader } from "@/src/app/chat/[id]/components/ChatHeader";
import { MessageList } from "@/src/app/chat/[id]/components/MessageList";
import { MessageInput } from "@/src/app/chat/[id]/components/MessageInput";
import { ChatConnecting } from "@/src/app/chat/[id]/components/ChatConnecting";
import { ImagePreviewModal } from "@/src/app/chat/[id]/components/ImagePreviewModal";
import { ImageViewerModal } from "@/src/app/chat/[id]/components/ImageViewerModal";
import { UserJoinedNotification } from '@/src/app/chat/[id]/components/UserJoinedNotification';
import { useImageHandling } from "@/src/app/chat/[id]/hooks/useImageHandling";

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
        scrollToBottom,
        notificationUser,
    } = useChat();

    const {
        previewImage,
        description,
        isModalOpen,
        handleImageSelect,
        handleImageSend,
        setDescription,
        closeModal,
    } = useImageHandling();

    const { openImageViewer, isImageViewerOpen, viewedImageUrl, closeImageViewer } = useImageViewer()

    if (connecting) {
        return <ChatConnecting roomId={roomId} />;
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            {notificationUser && (
                <UserJoinedNotification
                    key={notificationUser}
                    username={notificationUser}
                />
            )}
            <ChatHeader roomId={roomId} />
            <div className="relative flex flex-1 overflow-hidden">
                <MessageList
                    messages={messages}
                    username={username}
                    messagesEndRef={messagesEndRef}
                    scrollToBottom={scrollToBottom}
                    openImageViewer={openImageViewer}
                />
            </div>
            <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                handleImageSelect={handleImageSelect}
            />
            <ImagePreviewModal
                previewImage={previewImage!}
                description={description}
                isModalOpen={isModalOpen}
                setDescription={setDescription}
                handleImageSend={handleImageSend}
                closeModal={closeModal}
            />
            <ImageViewerModal
                isOpen={isImageViewerOpen}
                imageUrl={viewedImageUrl}
                onClose={closeImageViewer}
            />
        </div>
    );
}