"use client";
import { useState } from "react";
import { useSocket } from "@/components/providers/SocketProvider";

export function useImageHandling() {
    const socket = useSocket();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageSelect = (file: File) => {
        setSelectedImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string);
            setIsModalOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const closeModal = () => {
        if (isUploading) return;
        setPreviewImage(null);
        setDescription("");
        setIsModalOpen(false);
        setSelectedImageFile(null);
    };

    const handleImageSend = async (
        replyTo?: { id: string; author: string; messageSnippet: string },
        onOptimisticAdd?: (msg: any) => void,
        username?: string
    ) => {
        const fileToUpload = selectedImageFile; // Capture state
        const blobUrl = previewImage;

        if (!socket || !fileToUpload) return;

        // Optimistic UI
        const tempId = crypto.randomUUID();
        if (onOptimisticAdd && username && blobUrl) {
            const tempMsg = {
                id: tempId,
                username: username,
                userProfileImage: null,
                timestamp: new Date().toISOString(),
                replyTo: replyTo || null,
                imageUrl: blobUrl,
                description: description,
                isUploading: true,
                reactions: []
            };
            onOptimisticAdd(tempMsg);
        }

        // Close modal immediately
        setIsUploading(false);
        setPreviewImage(null);
        setDescription("");
        setIsModalOpen(false);
        setSelectedImageFile(null);

        // Step 1: Request Upload URL
        socket.emit('request-chat-image-upload', {
            contentType: fileToUpload.type,
            tempId
        });

        // Step 2: Receive Grant
        const handleGrant = async ({ tempId: grantedId, signedUploadUrl, publicUrl }: { tempId: string, signedUploadUrl: string, publicUrl: string }) => {
            if (grantedId !== tempId) return;

            socket.off('grant-chat-image-upload', handleGrant);

            try {
                // Step 3: Upload to Signed URL
                const response = await fetch(signedUploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': fileToUpload.type },
                    body: fileToUpload
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                // Step 4: Send Final Image Message
                socket.emit("image", {
                    imageUrl: publicUrl,
                    description,
                    replyTo
                });

            } catch (error) {
                console.error("Image upload error:", error);
            }
        };

        socket.on('grant-chat-image-upload', handleGrant);
    };

    return {
        previewImage,
        description,
        isModalOpen,
        selectedImageFile,
        isUploading,
        handleImageSelect,
        handleImageSend,
        setDescription,
        closeModal,
    };
}
