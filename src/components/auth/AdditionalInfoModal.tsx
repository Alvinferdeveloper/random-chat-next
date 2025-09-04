'use client';

// --- PRUEBA DE IDENTIFICACIÓN ---
console.log('--- RENDERIZANDO AdditionalInfoModal DESDE src/components/auth --- Version: ', new Date().getTime());
// --- FIN DE PRUEBA ---

import { useProfileSetup } from '@/src/app/hooks/useProfileSetup';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Badge } from '@/src/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/src/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/src/components/ui/select';

const ageRanges = {
    RANGE_19_24: '19-24',
    RANGE_25_34: '25-34',
    RANGE_35_44: '35-44',
    RANGE_45_PLUS: '45+',
};

const conversationTypes = {
    CASUAL: 'Casual',
    DEEP: 'Profunda',
    LEARNING: 'Aprender cosas nuevas',
    SHARING_EXPERIENCES: 'Compartir experiencias',
};

interface AdditionalInfoModalProps {
    isOpen: boolean;
    onProfileComplete: () => void;
    onClose?: () => void;
}

export function AdditionalInfoModal({ isOpen, onProfileComplete, onClose }: AdditionalInfoModalProps) {
    const {
        formState,
        setters,
        hobbies,
        loading,
        error,
        handleHobbyToggle,
        handleSubmit,
    } = useProfileSetup(isOpen, onProfileComplete);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose ? onClose() : null}>
            <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Un último paso...</DialogTitle>
                    <DialogDescription>
                        Completa tu perfil para encontrar mejores conversaciones.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Nombre de usuario *</Label>
                        <Input id="username" value={formState.username} onChange={(e) => setters.setUsername(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <Input id="location" value={formState.location} onChange={(e) => setters.setLocation(e.target.value)} placeholder="Ej: León, Nicaragua" />
                    </div>
                    <div className="space-y-2">
                        <Label>Rango de edad</Label>
                        <Select onValueChange={setters.setAgeRange} value={formState.ageRange}>
                            <SelectTrigger><SelectValue placeholder="Selecciona tu rango de edad" /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(ageRanges).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tipo de conversación</Label>
                        <Select onValueChange={setters.setConversationType} value={formState.conversationType}>
                            <SelectTrigger><SelectValue placeholder="¿Qué buscas en una charla?" /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(conversationTypes).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Hobbies</Label>
                        <div className="flex flex-wrap gap-2">
                            {hobbies.map(hobby => (
                                <Badge
                                    key={hobby.id}
                                    variant={formState.selectedHobbies.has(hobby.id) ? 'default' : 'secondary'}
                                    onClick={() => handleHobbyToggle(hobby.id)}
                                    className="cursor-pointer"
                                >
                                    {hobby.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={formState.bio} onChange={(e) => setters.setBio(e.target.value)} placeholder="Algo corto sobre ti..." />
                    </div>

                    {error && <p className="text-sm text-destructive text-center">{error}</p>}

                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Guardando...' : 'Guardar y continuar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}