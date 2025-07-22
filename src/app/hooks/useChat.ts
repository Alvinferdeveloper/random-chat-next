"use client"
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/components/providers/SocketProvider";
import { Message } from "@/src/types/chat";

export function useChat() {
    const params = useParams();
    const roomId = params.id as string;
    const socket = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [username, setUsername] = useState<string>("");
    const [connecting, setConnecting] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);


    useEffect(() => {
        let storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            storedUsername = `Usuario${Math.floor(Math.random() * 10000)}`;
            localStorage.setItem("username", storedUsername);
        }
        setUsername(storedUsername);

        if (socket) {
            socket.emit("joinRoom", roomId, storedUsername);
            setConnecting(false);

            const handleMessage = (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
            };

            const handleImage = (img: Message) => {
                setMessages((prev) => [...prev, img]);
            };

            const handleError = (errMsg: string) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        username: "Sistema",
                        message: errMsg,
                        timestamp: new Date().toISOString(),
                        system: true,
                    },
                ]);
            };

            socket.on("message", handleMessage);
            socket.on("image", handleImage);
            socket.on("error", handleError);

            return () => {
                socket.off("message", handleMessage);
                socket.off("image", handleImage);
                socket.off("error", handleError);
                socket.emit("leaveRoom", roomId);
            };
        }
    }, [roomId, socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !socket) return;
        socket.emit("message", newMessage);
        setNewMessage("");
    };

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
    };
}
