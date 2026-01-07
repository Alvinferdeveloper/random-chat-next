"use client"
import { useState, useEffect } from "react";
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
import { UserList } from "@/src/app/chat/[id]/components/UserList";
import { useHover } from "@/src/app/hooks/useHover";
import { cn } from "@/src/lib/utils";

export default function ChatPage() {
    const {
        roomId,
        messages,
        newMessage,
        username,
        connecting,
        messagesEndRef,
        replyingToMessage,
        notificationUser,
        usersInRoom,
        setNewMessage,
        handleSendMessage,
        scrollToBottom,
        setReplyingToMessage,
    } = useChat();

    const hasHover = useHover();
    const [isUserListVisible, setIsUserListVisible] = useState(false);

    useEffect(() => {
        // Default to visible on desktop, hidden on mobile
        setIsUserListVisible(hasHover);
    }, [hasHover]);

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

    const toggleUserList = () => setIsUserListVisible(!isUserListVisible);

    return (
        <div className="flex flex-col h-screen bg-background">
            {notificationUser && (
                <UserJoinedNotification
                    key={notificationUser}
                    username={notificationUser}
                />
            )}
            <ChatHeader
                roomId={roomId}
                isUserListVisible={isUserListVisible}
                onToggleUserList={toggleUserList}
            />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 flex flex-col">
                    <div className="relative flex-1 overflow-y-auto">
                        <MessageList
                            messages={messages}
                            username={username}
                            messagesEndRef={messagesEndRef}
                            scrollToBottom={scrollToBottom}
                            openImageViewer={openImageViewer}
                            setReplyingToMessage={setReplyingToMessage}
                        />
                    </div>
                    <MessageInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                        handleImageSelect={handleImageSelect}
                        replyingToMessage={replyingToMessage}
                        setReplyingToMessage={setReplyingToMessage}
                    />
                </main>

                {/* Desktop Sidebar */}
                <aside className={cn(
                    "hidden md:flex flex-col h-full transition-all duration-300 ease-in-out",
                    isUserListVisible ? "w-[300px]" : "w-0"
                )}>
                    <UserList users={usersInRoom} />
                </aside>

                {/* Mobile Overlay */}
                {isUserListVisible && !hasHover && (
                    <>
                        <div
                            onClick={toggleUserList}
                            className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
                        />
                        <aside className="fixed top-0 right-0 z-30 h-full w-[300px] bg-background transition-transform duration-300 ease-in-out translate-x-0">
                            <UserList users={usersInRoom} />
                        </aside>
                    </>
                )}
            </div>
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
