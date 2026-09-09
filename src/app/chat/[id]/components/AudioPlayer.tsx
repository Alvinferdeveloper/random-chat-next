import { useState, useRef } from "react";
import { Loader2, Play, Pause } from "lucide-react";

export function AudioPlayer({ url, isUploading, duration }: { url: string; isUploading?: boolean; duration?: number }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const formatSeconds = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-3 p-3 min-w-[220px] bg-black/[0.06] rounded-xl" onClick={(e) => e.stopPropagation()}>
            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                hidden
            />
            <button
                onClick={togglePlay}
                disabled={isUploading}
                className="w-10 h-10 shrink-0 rounded-full bg-current/15 flex items-center justify-center hover:bg-current/25 transition-colors disabled:opacity-50"
            >
                {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                ) : (
                    <Play className="w-5 h-5 fill-current ml-1" />
                )}
            </button>
            <div className="flex-1 space-y-1">
                <div className="h-1.5 w-full bg-current/15 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-current transition-[width] duration-100"
                        style={{ width: `${(currentTime / (audioRef.current?.duration || duration || 1)) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] opacity-70 font-bold">
                    <span>{formatSeconds(currentTime)}</span>
                    <span>{formatSeconds(duration || 0)}</span>
                </div>
            </div>
        </div>
    );
}
