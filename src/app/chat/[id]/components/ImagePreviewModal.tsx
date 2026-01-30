"use client"
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { X, Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { cn } from "@/src/lib/utils";

interface ImagePreviewModalProps {
    previewImage: string;
    description: string;
    isModalOpen: boolean;
    setDescription: (description: string) => void;
    handleImageSend: () => void;
    closeModal: () => void;
    isUploading: boolean;
}

export function ImagePreviewModal({
    previewImage,
    description,
    isModalOpen,
    setDescription,
    handleImageSend,
    closeModal,
    isUploading,
}: ImagePreviewModalProps) {
    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setDescription(description + emojiData.emoji);
        setShowPicker(false);
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-lg w-full">
                <div className="relative">
                    <img src={previewImage} alt="Preview" className="rounded-lg max-h-96 w-full object-contain" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full bg-gray-800 text-white"
                        onClick={closeModal}
                        disabled={isUploading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <div className="relative flex-grow">
                        {showPicker && (
                            <div className="absolute bottom-full mb-2 z-10">
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                        <div className="relative flex items-center">
                            <Input
                                type="text"
                                placeholder="Añade una descripción..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="pr-12"
                                disabled={isUploading}
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowPicker(!showPicker)}
                                className="absolute inset-y-0 right-0 flex items-center justify-center"
                                disabled={isUploading}
                            >
                                <Smile className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                    <Button onClick={handleImageSend} size="icon" className="flex-shrink-0" disabled={isUploading}>
                        <Send className={cn("w-4 h-4", isUploading && "animate-pulse")} />
                    </Button>
                </div>
            </div>
        </div>
    );
}