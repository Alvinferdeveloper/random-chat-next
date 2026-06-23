"use client"
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSocketHandler } from "@/src/app/hooks/useSocketHandler";
import { useJoinRoom } from "@/src/app/hooks/useJoinRoom";
import { useUsername } from "@/src/app/hooks/useUsername";
import { useMessageInput } from "@/src/app/chat/[id]/hooks/useMessageInput";
import { useAutoScroll } from "@/src/app/chat/[id]/hooks/useAutoScroll";
import { useImageViewer } from "@/src/app/chat/[id]/hooks/useImageViewer";
import { ChatHeader } from "@/src/app/chat/[id]/components/ChatHeader";
import { MessageList } from "@/src/app/chat/[id]/components/MessageList";
import { MessageInput } from "@/src/app/chat/[id]/components/MessageInput";
import { useFavoriteGifs } from "@/src/app/chat/[id]/hooks/useFavoriteGifs";
import { ChatConnecting } from "@/src/app/chat/[id]/components/ChatConnecting";
import { ImagePreviewModal } from "@/src/app/chat/[id]/components/ImagePreviewModal";
import { ImageViewerModal } from "@/src/app/chat/[id]/components/ImageViewerModal";
import { UserJoinedNotification } from '@/src/app/chat/[id]/components/UserJoinedNotification';
import { useImageHandling } from "@/src/app/chat/[id]/hooks/useImageHandling";
import { UserList } from "@/src/app/chat/[id]/components/UserList";
import { TypingIndicator } from "@/src/app/chat/[id]/components/TypingIndicator";
import { useHover } from "@/src/app/hooks/useHover";
import { cn } from "@/src/lib/utils";
import { isTextMessage } from "@/src/types/chat";
import { ConfirmDialog } from "@/src/app/components/shared/ConfirmDialog";
import { useTheme } from "next-themes";
import CampfireBackground from "@/src/app/chat/[id]/components/CampfireBackground";
import CampfireLottie from "@/src/app/chat/[id]/components/CampfireLottie";
import ParkBackground from "@/src/app/chat/[id]/components/ParkBackground";
import TreeIllustration from "@/src/app/chat/[id]/components/TreeIllustration";

export default function ChatPage() {
    const params = useParams();
    const id = params.id;
    const { username } = useUsername();
    const { connecting } = useJoinRoom(id as string, username);
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const searchParams = useSearchParams();
    const roomName = searchParams.get("roomName");

    const {
        messages,
        notificationUser,
        usersInRoom,
        typingUsers,
        startTyping,
        stopTyping,
        sendReaction,
        addOptimisticMessage,
        editingMessage,
        setEditingMessage,
        editMessage,
        deleteMessage
    } = useSocketHandler();

    const {
        newMessage,
        setNewMessage,
        replyingToMessage,
        setReplyingToMessage,
        isMentionListVisible,
        mentionQuery,
        handleSendMessage,
        handleSelectMention,
        cancelEdit
    } = useMessageInput(editingMessage, setEditingMessage, editMessage);

    const { messagesEndRef, scrollToBottom } = useAutoScroll(messages);

    // Single instance of favorites for the entire chat page
    const { favoriteGifs, toggleFavorite, loadingFavorites } = useFavoriteGifs();

    const hasHover = useHover();
    const [isUserListVisible, setIsUserListVisible] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
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
        isUploading,
    } = useImageHandling();

    const { openImageViewer, isImageViewerOpen, viewedImageUrl, closeImageViewer } = useImageViewer()

    if (connecting) {
        return <ChatConnecting roomId={id as string} />;
    }

    const toggleUserList = () => setIsUserListVisible(!isUserListVisible);

    const handleSendImageWithReply = () => {
        let replyContext = undefined;
        if (replyingToMessage) {
            const messageSnippet = isTextMessage(replyingToMessage)
                ? replyingToMessage.message.substring(0, 50)
                : '[Imagen]';

            replyContext = {
                id: replyingToMessage.id,
                author: replyingToMessage.username,
                messageSnippet: messageSnippet.length === 50 ? `${messageSnippet}...` : messageSnippet,
            };
        }
        handleImageSend(replyContext, addOptimisticMessage, username);
    }

    const currentTheme = resolvedTheme || theme;

    return (
        <div className="flex flex-col h-screen bg-transparent">
            {mounted && (currentTheme === "light" ? <ParkBackground /> : <CampfireBackground />)}
            {notificationUser && (
                <UserJoinedNotification
                    key={notificationUser}
                    username={notificationUser}
                />
            )}
            <ChatHeader
                roomId={id as string}
                roomName={roomName as string}
                isUserListVisible={isUserListVisible}
                onToggleUserList={toggleUserList}
            />
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 flex flex-col relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        {mounted && (currentTheme === "light" ? (
                            <TreeIllustration className="w-80 h-80 opacity-90" />
                        ) : (
                            <CampfireLottie src="/illustrations/fire/animations/12345.json" className="w-64 h-64 opacity-80" />
                        ))}
                    </div>
                    <div className="relative z-10 flex-1 scrollbar-thin-light">
                        <MessageList
                            messages={messages}
                            username={username}
                            messagesEndRef={messagesEndRef}
                            scrollToBottom={scrollToBottom}
                            openImageViewer={openImageViewer}
                            usersInRoom={usersInRoom}
                            setReplyingToMessage={setReplyingToMessage}
                            sendReaction={sendReaction}
                            favoriteGifs={favoriteGifs}
                            toggleFavorite={toggleFavorite}
                            onEdit={(msg) => setEditingMessage(msg)}
                            onDelete={(id) => setDeleteConfirmId(id)}
                        />
                    </div>
                    <TypingIndicator typingUsers={typingUsers} />
                    <MessageInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSendMessage={handleSendMessage}
                        handleImageSelect={handleImageSelect}
                        replyingToMessage={replyingToMessage}
                        setReplyingToMessage={setReplyingToMessage}
                        usersInRoom={usersInRoom}
                        isMentionListVisible={isMentionListVisible}
                        mentionQuery={mentionQuery}
                        handleSelectMention={handleSelectMention}
                        onStartTyping={startTyping}
                        onStopTyping={stopTyping}
                        favoriteGifs={favoriteGifs}
                        toggleFavorite={toggleFavorite}
                        loadingFavorites={loadingFavorites}
                        editingMessage={editingMessage}
                        cancelEdit={cancelEdit}
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
                handleImageSend={handleSendImageWithReply}
                closeModal={closeModal}
                isUploading={isUploading}
            />
            <ImageViewerModal
                isOpen={isImageViewerOpen}
                imageUrl={viewedImageUrl}
                onClose={closeImageViewer}
            />
            <ConfirmDialog
                isOpen={deleteConfirmId !== null}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={() => {
                    if (deleteConfirmId) {
                        deleteMessage(deleteConfirmId);
                    }
                    setDeleteConfirmId(null);
                }}
                title="Eliminar mensaje"
                description="¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
            />
        </div>
    );
}
