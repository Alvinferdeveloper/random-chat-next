'use client';

import { Search, X } from 'lucide-react';
import { useRef } from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Buscar...", className = "" }: SearchBarProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        onChange('');
        inputRef.current?.focus();
    };

    return (
        <div className={`relative w-full max-w-2xl group ${className}`}>
            {/* Magnifying glass icon that changes color when the input is focused */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            </div>

            <input
                ref={inputRef}
                type="text"
                className="flex h-10 w-full rounded-full border border-input bg-background pl-10 pr-10 py-2 text-sm shadow-sm transition-all duration-200 
                placeholder:text-muted-foreground 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary
                disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />

            {/* Clear button that appears when there is text */}
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Borrar búsqueda"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}