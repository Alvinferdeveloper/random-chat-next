'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MessageSquare, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRoomSearch } from '@/src/app/hooks/useRoomSearch';
import { useTranslation } from '@/src/app/lib/i18n';

interface SearchResult {
    id: string;
    name: string;
    type: 'room';
    description?: string;
    onlineCount?: number;
    serverIcon: string;
}

export function GlobalSearch() {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { rooms, loading: isLoading } = useRoomSearch(query);
    //  Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const results: SearchResult[] = rooms.map(room => ({
        id: room.id,
        name: room.name,
        type: 'room',
        description: room.short_description,
        onlineCount: room.activeUsers,
        serverIcon: room.server_icon
    }));

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        router.push(`/chat/${result.id}`);
    };

    return (
        <div className="relative w-full max-w-md" ref={containerRef}>
            <div className="relative group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={t('layout.search.placeholder')}
                    className="w-full h-10 pl-10 pr-4 bg-secondary/50 hover:bg-secondary/80 focus:bg-background border-none rounded-2xl text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                    >
                        <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                )}
            </div>

            {/* Panel de Resultados */}
            {isOpen && (query.length >= 2 || isLoading) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : results.length > 0 ? (
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                <div className="space-y-1">
                                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('layout.search.results_header')}</p>
                                    {results.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleSelect(result)}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-secondary rounded-xl transition-colors text-left cursor-pointer"
                                        >
                                            <div className="w-10 h-10 rounded-full">
                                                {result.serverIcon ? (
                                                    <img src={result.serverIcon} className='w-full h-full object-cover rounded-full' alt="" />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-full">
                                                        <span className="text-primary text-xl font-bold">
                                                            {result.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium truncate">{result.name}</p>
                                                    <span className="text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full font-bold">
                                                        {t('layout.search.online_count', { count: result.onlineCount })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-10 text-center">
                                <p className="text-sm text-muted-foreground italic">{t('layout.search.no_results', { query })}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
