"use client";
import { useState } from "react";
import { useSocket } from "@/components/providers/SocketProvider";

export function useImageHandling() {
    const socket = useSocket();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

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
        setPreviewImage(null);
        setDescription("");
        setIsModalOpen(false);
        setSelectedImageFile(null);
    };

    const handleImageSend = () => {
        if (!socket || !selectedImageFile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const image = e.target?.result as ArrayBuffer;
            socket.emit("image", { image, description });
            closeModal();
        };
        reader.readAsArrayBuffer(selectedImageFile);
    };

    return {
        previewImage,
        description,
        isModalOpen,
        selectedImageFile,
        handleImageSelect,
        handleImageSend,
        setDescription,
        closeModal,
    };
}
