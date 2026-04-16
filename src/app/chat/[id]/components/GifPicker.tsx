"use client";
import { Input } from "@/src/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useGifSearch } from "@/src/app/chat/[id]/hooks/useGifSearch";
import { useInfiniteScroll } from "@/src/app/hooks/useInfiniteScroll";

interface GifPickerProps {
    onSelect: (gifUrl: string) => void;
}

export function GifPicker({ onSelect }: GifPickerProps) {
    const { search, setSearch, gifs, loading, loadingMore, loadMore, hasMore } = useGifSearch();

    const { sentinelRef } = useInfiniteScroll({
        loading: loading || loadingMore,
        hasMore,
        onLoadMore: loadMore
    });

    return (
        <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col w-[300px] h-[400px] animate-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-border bg-muted/30">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar GIFs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 bg-background border-none focus-visible:ring-1 focus-visible:ring-primary h-9 text-sm"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                {loading && gifs.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            {gifs.map((gif, index) => (
                                <div
                                    key={`${gif.id}-${index}`}
                                    onClick={() => onSelect(gif.images.fixed_height.url)}
                                    className="cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition-opacity aspect-video bg-muted"
                                >
                                    <img
                                        src={gif.images.fixed_height_small.url}
                                        alt={gif.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Centinela para el scroll infinito */}
                        <div ref={sentinelRef} className="h-10 flex items-center justify-center w-full mt-2">
                            {loadingMore && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        </div>
                    </>
                )}
                {!loading && gifs.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground text-xs font-medium">
                        No se encontraron GIFs
                    </div>
                )}
            </div>
            <div className="p-2 border-t border-border bg-muted/30 text-center">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Powered by Giphy</span>
            </div>
        </div>
    );
}
