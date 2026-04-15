"use client";
import { useState, useRef } from "react";
import { useSocket } from "@/src/app/components/providers/SocketEventProvider";

export function useAudioRecording() {
    const socket = useSocket();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("No se pudo acceder al micrófono:", err);
            alert("Necesitas dar permisos de micrófono para enviar notas de voz.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setAudioBlob(null);
        setRecordingTime(0);
    };

    const sendAudioNote = async (
        replyTo?: any,
        onOptimisticAdd?: (msg: any) => void,
        username?: string
    ) => {
        if (!socket || !audioBlob || !username) return;

        const tempId = crypto.randomUUID();
        const duration = recordingTime;
        const localUrl = URL.createObjectURL(audioBlob);

        // Optimistic UI
        if (onOptimisticAdd) {
            onOptimisticAdd({
                id: tempId,
                username,
                userProfileImage: null,
                timestamp: new Date().toISOString(),
                replyTo: replyTo || null,
                audioUrl: localUrl,
                duration,
                isUploading: true,
                reactions: []
            });
        }

        // 1. Request Upload URL
        socket.emit('request-chat-image-upload', {
            contentType: audioBlob.type,
            tempId
        });

        // 2. Handle Grant
        const handleGrant = async ({ tempId: grantedId, signedUploadUrl, publicUrl }: any) => {
            if (grantedId !== tempId) return;
            socket.off('grant-chat-image-upload', handleGrant);

            try {
                // 3. Upload to Supabase
                const res = await fetch(signedUploadUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': audioBlob.type },
                    body: audioBlob
                });

                if (!res.ok) throw new Error('Upload failed');

                // 4. Emit final audio message
                socket.emit('audio', {
                    audioUrl: publicUrl,
                    duration,
                    replyTo,
                    tempId
                });
            } catch (err) {
                console.error("Audio upload error:", err);
            }
        };

        socket.on('grant-chat-image-upload', handleGrant);
        setAudioBlob(null);
        setRecordingTime(0);
    };

    return {
        isRecording,
        recordingTime,
        audioBlob,
        startRecording,
        stopRecording,
        cancelRecording,
        sendAudioNote
    };
}
