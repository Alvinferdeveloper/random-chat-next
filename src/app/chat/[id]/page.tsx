"use client"
import { useChat } from "@/src/app/hooks/useChat";
import { useImageViewer } from "@/src/app/hooks/useImageViewer";
import { ChatHeader } from "@/src/app/chat/[id]/components/ChatHeader";
import { MessageList } from "@/src/app/chat/[id]/components/MessageList";
import { MessageInput } from "@/src/app/chat/[id]/components/MessageInput";
import { ChatConnecting } from "@/src/app/chat/[id]/components/ChatConnecting";
import { ImagePreviewModal } from "@/src/app/chat/[id]/components/ImagePreviewModal";
import { ImageViewerModal } from "@/src/app/chat/[id]/components/ImageViewerModal";

export default function ChatPage() {
    const {
        roomId,
        messages,
        newMessage,
        username,
        connecting,
        messagesEndRef,
        previewImage,
        description,
        isModalOpen,
        setNewMessage,
        handleSendMessage,
        handleImageSelect,
        handleImageSend,
        setDescription,
        closeModal,
        scrollToBottom,
    } = useChat();

    const { openImageViewer, isImageViewerOpen, viewedImageUrl, closeImageViewer } = useImageViewer()

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