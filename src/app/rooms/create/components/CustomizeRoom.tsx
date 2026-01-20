'use client';

import { useState, useRef } from 'react';
import { useCreateRoom } from '../hooks/useCreateRoom';
import { Button } from '@/src/components/ui/button';
import { Loader2, Upload, Image as ImageIcon, CheckCircle2, Eye, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { cn } from '@/src/lib/utils';
import Link from 'next/link';

interface RoomData {
    id: string;
    name: string;
    short_description?: string;
}

interface CustomizeRoomProps {
    room: RoomData;
}

export function CustomizeRoom({ room }: CustomizeRoomProps) {
    const { uploadRoomImage, uploading, uploadError } = useCreateRoom();
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);
    const [iconUrl, setIconUrl] = useState<string | null>(null);

    const bannerInputRef = useRef<HTMLInputElement>(null);
    const iconInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'icon') => {
        const file = event.target.files?.[0];
        if (!file) return;

        const result = await uploadRoomImage(room.id, type, file);
        if (result.success && result.publicUrl) {
            if (type === 'banner') {
                setBannerUrl(result.publicUrl);
            } else {
                setIconUrl(result.publicUrl);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left Column: Upload Controls */}
            <div className="space-y-6">
                <Card className="border-border/50 shadow-md bg-card/50 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle>Carga de Recursos</CardTitle>
                        <CardDescription>Formatos: JPG, PNG, WEBP.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Banner Upload Area */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium">Portada (Banner)</h3>
                                {bannerUrl && <span className="text-xs text-green-500 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Listo</span>}
                            </div>

                            <input type="file" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} className="hidden" accept="image/*" />

                            <div
                                onClick={() => bannerInputRef.current?.click()}
                                className={cn(
                                    "relative group border-2 border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden",
                                    "hover:border-primary hover:bg-primary/5",
                                    bannerUrl ? "border-green-500/50 bg-green-500/5" : ""
                                )}
                            >
                                {uploading === 'banner' ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                                        <p className="text-xs text-muted-foreground">Subiendo...</p>
                                    </div>
                                ) : bannerUrl ? (
                                    <>
                                        <img src={bannerUrl} alt="Banner Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity" />
                                        <div className="z-10 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border flex items-center gap-2">
                                            <Upload className="h-3 w-3" />
                                            <span className="text-xs font-medium">Cambiar imagen</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-6 w-6 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                                        <p className="text-sm font-medium">Subir Banner</p>
                                        <p className="text-xs text-muted-foreground mt-1">1280x720 px</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Icon Upload Area */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium">Icono / Avatar</h3>
                                {iconUrl && <span className="text-xs text-green-500 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Listo</span>}
                            </div>

                            <input type="file" ref={iconInputRef} onChange={(e) => handleFileChange(e, 'icon')} className="hidden" accept="image/*" />

                            <div className="flex items-center gap-4">
                                <div
                                    onClick={() => iconInputRef.current?.click()}
                                    className={cn(
                                        "relative group h-24 w-24 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer transition-all overflow-hidden shrink-0",
                                        "hover:border-primary hover:bg-primary/5",
                                        iconUrl ? "border-green-500/50" : ""
                                    )}
                                >
                                    {uploading === 'icon' ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    ) : iconUrl ? (
                                        <>
                                            <img src={iconUrl} alt="Icon" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="h-5 w-5 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <ImageIcon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <p>Se mostrará en listas y chats.</p>
                                    <p className="text-xs mt-1">Recomendado: 512x512 px</p>
                                </div>
                            </div>
                        </div>

                        {uploadError && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium text-center">
                                {uploadError}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                    <Link href={`/chat/${room.id}`} passHref className="w-full">
                        <Button className="w-full cursor-pointer h-12 text-base shadow-lg shadow-primary/20" size="lg">
                            Finalizar y entrar a la Sala
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">
                        Puedes cambiar esto más tarde en la configuración.
                    </p>
                </div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="hidden lg:block sticky top-8">
                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">Vista Previa</span>
                </div>

                {/* Mock Card */}
                <div className="relative group rounded-xl overflow-hidden border border-border bg-card shadow-2xl transition-all duration-300 hover:shadow-primary/10 hover:-translate-y-1">
                    {/* Mock Banner */}
                    <div className="h-40 w-full bg-secondary/50 relative overflow-hidden">
                        {bannerUrl ? (
                            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
                                <span className="text-muted-foreground/50 text-sm">Sin Banner</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Mock Content */}
                    <div className="p-5 relative">
                        {/* Mock Icon - Floating above the banner */}
                        <div className="absolute -top-10 left-5">
                            <div className="h-20 w-20 rounded-2xl border-4 border-card bg-secondary shadow-lg overflow-hidden flex items-center justify-center">
                                {iconUrl ? (
                                    <img src={iconUrl} alt="Icon" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-muted-foreground/50 uppercase">
                                        {room.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 space-y-2">
                            <h3 className="text-xl font-bold leading-tight">{room.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {room.short_description || "Esta es una vista previa de cómo se verá la descripción corta de tu sala ante los demás usuarios."}
                            </p>

                            <div className="pt-4 flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    1 En línea
                                </div>
                                <div>0 Miembros</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Así es como verán tu sala los futuros miembros.
                    </p>
                </div>
            </div>
        </div>
    );
}