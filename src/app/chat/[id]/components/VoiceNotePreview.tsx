"use client"
import { Button } from "@/src/components/ui/button";
import { Mic } from "lucide-react";
import { formatTime } from "@/src/app/chat/[id]/utils/time";
import { useTranslation } from "react-i18next";

interface Props {
    recordingTime: number;
    cancelRecording: () => void;
    handleSendAudio: () => void;
}

export default function VoiceNotePreview({ recordingTime, cancelRecording, handleSendAudio }: Props) {
    const { t } = useTranslation();
    return (
        <div className="absolute bottom-full left-0 right-0 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300 z-30">
            <div className="bg-background border border-border p-3 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Mic className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold">{t('chat.voice_note.ready')}</span>
                        <span className="text-xs text-muted-foreground">{formatTime(recordingTime)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={cancelRecording} className="rounded-lg text-xs font-bold uppercase cursor-pointer">{t('chat.voice_note.discard')}</Button>
                    <Button size="sm" onClick={handleSendAudio} className="rounded-lg px-4 bg-primary hover:bg-primary/90 cursor-pointer text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 transition-transform">{t('chat.voice_note.send')}</Button>
                </div>
            </div>
        </div>
    )
}