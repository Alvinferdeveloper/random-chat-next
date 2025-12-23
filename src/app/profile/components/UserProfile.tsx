'use client';

import { useUserProfile } from '../hooks/useUserProfile';
import { EditableField } from './EditableField';
import { EditableSelectField } from './EditableSelectField';
import { EditableHobbies } from './EditableHobbies';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Mail, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { ageRangeOptions, conversationTypeOptions } from '@/src/app/constants';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
};

export function UserProfile() {
    const { user, loading, error, form, updateProfileField, allHobbies, hobbiesLoading } = useUserProfile();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 h-64">
                <div className="h-12 w-12 border-4 border-primary/30 border-t-primary animate-spin rounded-full" />
                <p className="text-muted-foreground animate-pulse">Cargando tu perfil...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!user) {
        return <p className="text-center text-muted-foreground">No se pudo encontrar el perfil del usuario.</p>;
    }

    const handleImageUpload = () => {
        const newImageUrl = prompt("Ingresa la nueva URL de la imagen de perfil:", user.profileImage || '');
        if (newImageUrl !== null && newImageUrl.trim() !== '') {
            updateProfileField('profileImage', newImageUrl);
        }
    };


    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto pb-12">
            <motion.div variants={itemVariants}>
                <Card className="overflow-hidden shadow-xl border-border/40 bg-card/60 backdrop-blur-xl mb-8">
                    <CardHeader className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <Avatar className="h-36 w-36 border-4 border-background shadow-2xl relative">
                                    <AvatarImage src={user.profileImage || undefined} className="object-cover" />
                                    <AvatarFallback className="text-5xl bg-gradient-to-br from-muted to-muted/50">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    className="absolute bottom-2 right-2 rounded-full h-10 w-10 shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300"
                                    onClick={handleImageUpload}
                                >
                                    <Upload className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <EditableField
                                    name="username"
                                    label="Nombre de Usuario"
                                    value={user.username}
                                    control={form.control}
                                    updateFn={updateProfileField}
                                    inputClassName="text-4xl font-black tracking-tight"
                                    labelClassName="hidden" // Escondemos el label arriba para usar el diseño gigante
                                />
                                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="h-4 w-4" /> {user.email}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="md:col-span-2 space-y-6">
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-lg border-border/40 bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Detalles Personales</CardTitle>
                                <CardDescription>Esta información ayuda a otros a conocerte mejor.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <EditableField
                                    name="bio"
                                    label="Biografía"
                                    value={user.bio}
                                    control={form.control}
                                    updateFn={updateProfileField}
                                    isTextarea
                                    placeholder="Cuéntanos un poco sobre ti..."
                                    maxLength={200}
                                />
                                <EditableField
                                    name="location"
                                    label="Ubicación"
                                    value={user.location}
                                    control={form.control}
                                    updateFn={updateProfileField}
                                    placeholder="Ciudad, País"
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-lg border-border/40 bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Aficiones</CardTitle>
                                <CardDescription>Selecciona las aficiones que te representan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EditableHobbies
                                    name="hobbies"
                                    label=""
                                    userHobbies={user.hobbies}
                                    allHobbies={allHobbies}
                                    hobbiesLoading={hobbiesLoading}
                                    control={form.control}
                                    updateFn={updateProfileField}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-lg border-border/40 bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Información de Contacto</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between py-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Correo Electrónico</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-base break-all">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-lg border-border/40 bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Preferencias de Chat</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <EditableSelectField
                                    name="ageRange"
                                    label="Rango de Edad"
                                    value={user.ageRange}
                                    control={form.control}
                                    updateFn={updateProfileField}
                                    options={ageRangeOptions}
                                    placeholder="Selecciona tu edad"
                                />

                                <EditableSelectField
                                    name="conversationType"
                                    label="Tipo de Conversación"
                                    value={user.conversationType}
                                    control={form.control}
                                    updateFn={updateProfileField}
                                    options={conversationTypeOptions}
                                    placeholder="¿Qué tipo de chat prefieres?"
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
