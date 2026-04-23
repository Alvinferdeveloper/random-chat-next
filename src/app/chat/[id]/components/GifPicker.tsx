"use client";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Loader2, Search, Heart } from "lucide-react";
import { useGifSearch } from "@/src/app/chat/[id]/hooks/useGifSearch";
import { useInfiniteScroll } from "@/src/app/hooks/useInfiniteScroll";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/app/hooks/useAuth";

interface GifPickerProps {
    onSelect: (gifUrl: string, giphyId: string) => void;
    favoriteGifs: any[];
    toggleFavorite: (giphyId: string, url: string, title?: string) => void;
    loadingFavorites: boolean;
}

type Tab = "search" | "favorites";

const ENABLE_GIPHY = process.env.NEXT_PUBLIC_ENABLE_GIPHY === "true";

export function GifPicker({ onSelect, favoriteGifs, toggleFavorite, loadingFavorites }: GifPickerProps) {
    const { session } = useAuth();

    // Default logic: If Giphy is disabled, must be favorites. 
    // If Giphy enabled, priority to favorites for logged in, search for anonymous.
    const initialTab = !ENABLE_GIPHY ? "favorites" : (session ? "favorites" : "search");
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);

    const {
        search,
        setSearch,
        gifs,
        loading,
        loadingMore,
        loadMore,
        hasMore
    } = useGifSearch();

    const { sentinelRef } = useInfiniteScroll({
        loading: loading || loadingMore,
        hasMore: activeTab === "search" ? hasMore : false,
        onLoadMore: loadMore
    });

    const isGifFavorite = (giphyId: string) => favoriteGifs.some(g => g.giphyId === giphyId);

    const handleToggleFavorite = (e: React.MouseEvent, gif: any) => {
        e.stopPropagation();
        if (!session) return;
        const giphyId = gif.giphyId || gif.id;
        const url = gif.images?.fixed_height?.url || gif.url;
        const title = gif.title || "";
        toggleFavorite(giphyId, url, title);
    };

    return (
        <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col w-[320px] h-[450px] animate-in zoom-in-95 duration-200">
            {/* Header / Tabs */}
            <div className="flex border-b border-border bg-muted/30 p-1 gap-1">
                {session && (
                    <button
                        onClick={() => setActiveTab("favorites")}
                        className={cn(
                            "flex-1 py-1.5 cursor-pointer text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5",
                            activeTab === "favorites" ? "bg-background shadow-sm text-red-500" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Heart className={cn("h-3 w-3", activeTab === "favorites" && "fill-current")} />
                        Favoritos
                    </button>
                )}

                {ENABLE_GIPHY && (
                    <button
                        onClick={() => setActiveTab("search")}
                        className={cn(
                            "flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer",
                            activeTab === "search" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Explorar
                    </button>
                )}
            </div>

            {/* Search Input - Only shown if Giphy is enabled AND search tab is active */}
            {activeTab === "search" && ENABLE_GIPHY && (
                <div className="p-3 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar GIFs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-9 text-sm"
                        />
                    </div>
                </div>
            )}

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                {activeTab === "favorites" ? (
                    loadingFavorites ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : favoriteGifs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-4">
                            <Heart className="h-8 w-8 text-muted-foreground/30" />
                            <p className="text-xs text-muted-foreground font-medium">
                                {session ? "Aún no tienes GIFs favoritos" : "Inicia sesión para guardar GIFs"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {favoriteGifs.map((gif) => (
                                <div
                                    key={gif.id}
                                    onClick={() => onSelect(gif.url, gif.giphyId)}
                                    className="group relative cursor-pointer rounded-lg overflow-hidden aspect-video bg-muted"
                                >
                                    <img
                                        src={gif.url}
                                        alt={gif.title || "GIF"}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    {session && (
                                        <button
                                            onClick={(e) => handleToggleFavorite(e, gif)}
                                            className="absolute cursor-pointer top-1 right-1 p-1.5 rounded-full bg-black/40 backdrop-blur-md"
                                        >
                                            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    /* Search Tab View (Only accessible if ENABLE_GIPHY is true) */
                    loading && gifs.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-2">
                                {gifs.map((gif, index) => (
                                    <div
                                        key={`${gif.id}-${index}`}
                                        onClick={() => onSelect(gif.images.fixed_height.url, gif.id)}
                                        className="group relative cursor-pointer rounded-lg overflow-hidden aspect-video bg-muted"
                                    >
                                        <img
                                            src={gif.images.fixed_height_small.url}
                                            alt={gif.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        {session && (
                                            <button
                                                onClick={(e) => handleToggleFavorite(e, gif)}
                                                className="absolute top-1 right-1 p-1.5 rounded-full bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Heart className={cn(
                                                    "h-3.5 w-3.5 cursor-pointer text-white transition-colors",
                                                    isGifFavorite(gif.id) && "fill-red-500 text-red-500"
                                                )} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div ref={sentinelRef} className="h-10 flex items-center justify-center w-full mt-2">
                                {loadingMore && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                            </div>
                        </>
                    )
                )}

                {activeTab === "search" && ENABLE_GIPHY && !loading && gifs.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground text-xs font-medium">
                        No se encontraron GIFs
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-border bg-muted/30 text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    {activeTab === "search" ? "Powered by Giphy" : `${favoriteGifs.length} GIFs Guardados`}
                </span>
            </div>
        </div>
    );
}
