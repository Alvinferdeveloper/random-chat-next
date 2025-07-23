'use client'
import { X } from 'lucide-react';

interface ImageViewerModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

export function ImageViewerModal({ isOpen, imageUrl, onClose }: ImageViewerModalProps) {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
            <div
                className={`relative max-w-4xl max-h-[90vh] w-full h-full transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'
                    }`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
            >
                <button
                    onClick={onClose}
                    className="absolute right-0 text-white bg-gray-600 rounded-full p-2 hover:bg-gray-700 transition-colors"
                >
                    <X size={24} />
                </button>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Visor de imagen"
                        className="w-full h-full object-contain rounded-lg shadow-2xl"
                    />
                )}
            </div>
        </div>
    );
}
