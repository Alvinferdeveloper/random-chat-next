'use client';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '../hooks/useUserProfile';
import { EditableField } from './EditableField';
import { EditableSelectField } from './EditableSelectField';
import { EditableHobbies } from './EditableHobbies';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { Mail, Upload, Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
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

export function UserProfile({ targetUsername }: { targetUsername?: string }) {
    const { t } = useTranslation();
    const { user, loading, error, form, updateProfileField, allHobbies, hobbiesLoading, uploadImage, isUploading } = useUserProfile(targetUsername);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isReadOnly = !!targetUsername;

    const ageRangeOptions = [
        { value: 'RANGE_19_24', label: t('profile.age_range.19_24') },
        { value: 'RANGE_25_34', label: t('profile.age_range.25_34') },
        { value: 'RANGE_35_44', label: t('profile.age_range.35_44') },
        { value: 'RANGE_45_PLUS', label: t('profile.age_range.45_plus') },
    ];

    const conversationTypeOptions = [
        { value: 'CASUAL', label: t('profile.conversation_type.casual') },
        { value: 'DEEP', label: t('profile.conversation_type.deep') },
        { value: 'LEARNING', label: t('profile.conversation_type.learning') },
        { value: 'SHARING', label: t('profile.conversation_type.sharing') },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 h-64">
                <div className="h-12 w-12 border-4 border-primary/30 border-t-primary animate-spin rounded-full" />
                <p className="text-muted-foreground animate-pulse">
                    {isReadOnly ? t('profile.loading_other', { targetUsername }) : t('profile.loading_own')}
                </p>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    if (!user) {
        return <p className="text-center text-muted-foreground mt-10">{t('profile.not_found')}</p>;
    }

    const handleImageUpload = () => {
        if (isReadOnly) return;
        fileInputRef.current?.click();
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };


    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto pb-12">
            {!isReadOnly && (
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                />
            )}
            <motion.div variants={itemVariants}>
                <Card className="overflow-hidden shadow-xl border-border/40 bg-card/20 backdrop-blur-xl mb-8 relative">
                    <div
                        className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none"
                        style={{
                            backgroundImage: "url('/illustrations/profile_background.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <CardHeader className="p-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <Avatar className="h-36 w-36 border-4 border-background shadow-2xl relative">
                                    <AvatarImage src={user.image || undefined} className="object-cover" />
                                    <AvatarFallback className="text-5xl bg-gradient-to-br from-muted to-muted/50">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                            <Loader2 className="h-10 w-10 text-white animate-spin" />
                                        </div>
                                    )}
                                </Avatar>
                                {!isReadOnly && (
                                    <Button
                                        size="icon"
                                        className="absolute bottom-2 right-2 rounded-full h-10 w-10 shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300"
                                        onClick={handleImageUpload}
                                        disabled={isUploading}
                                    >
                                        <Upload className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <EditableField
                                    name="username"
                                    label={t('profile.username_label')}
                                    value={user.username}
                                    updateFn={updateProfileField}
                                    inputClassName="text-4xl font-black tracking-tight"
                                    labelClassName="hidden"
                                    readOnly={isReadOnly}
                                />
                                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="h-4 w-4" /> {isReadOnly ? t('profile.private_email') : user.email}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="md:col-span-2 space-y-6">
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-lg border-border/40 bg-card/20 backdrop-blur-sm relative">
                            <div
                                className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none"
                                style={{
                                    backgroundImage: "url('/illustrations/profile_background.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                            <CardHeader className="relative z-10">
                                <CardTitle>{t('profile.details_title')}</CardTitle>
                                <CardDescription>
                                    {isReadOnly ? t('profile.details_description_other', { username: user.username }) : t('profile.details_description_own')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 relative z-10">
                                <EditableField
                                    name="bio"
                                    label={t('profile.bio_label')}
                                    value={user.bio}
                                    updateFn={updateProfileField}
                                    isTextarea
                                    placeholder={t('profile.bio_placeholder')}
                                    maxLength={200}
                                    readOnly={isReadOnly}
                                />
                                <EditableField
                                    name="location"
                                    label={t('profile.location_label')}
                                    value={user.location}
                                    updateFn={updateProfileField}
                                    placeholder={t('profile.location_placeholder')}
                                    readOnly={isReadOnly}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-lg border-border/40 bg-card/20 backdrop-blur-sm relative">
                            <div
                                className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none"
                                style={{
                                    backgroundImage: "url('/illustrations/profile_background.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                            <CardHeader className="relative z-10">
                                <CardTitle>{t('profile.hobbies_title')}</CardTitle>
                                <CardDescription>
                                    {isReadOnly ? t('profile.hobbies_description_other', { username: user.username }) : t('profile.hobbies_description_own')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <EditableHobbies
                                    name="hobbies"
                                    label=""
                                    userHobbies={user.hobbies}
                                    allHobbies={allHobbies}
                                    hobbiesLoading={hobbiesLoading}
                                    control={form.control}
                                    updateFn={updateProfileField}
                                    readOnly={isReadOnly}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-lg border-border/40 bg-card/20 backdrop-blur-sm relative">
                            <div
                                className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none"
                                style={{
                                    backgroundImage: "url('/illustrations/profile_background.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                            <CardHeader className="relative z-10">
                                <CardTitle>{t('profile.contact_title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="flex items-center justify-between py-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">{t('profile.email_label')}</Label>
                                        <div className="mt-1 flex items-center gap-2">
                                            {isReadOnly ? (
                                                <>
                                                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                                                    <p className="text-base text-muted-foreground italic">{t('profile.email_protected')}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-base break-all">{user.email}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="shadow-lg border-border/40 bg-card/20 backdrop-blur-sm relative">
                            <div
                                className="absolute inset-0 z-0 opacity-20 dark:opacity-30 mix-blend-overlay pointer-events-none"
                                style={{
                                    backgroundImage: "url('/illustrations/profile_background.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                            <CardHeader className="relative z-10">
                                <CardTitle>{t('profile.chat_preferences_title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 relative z-10">
                                <EditableSelectField
                                    name="ageRange"
                                    label={t('profile.age_range_label')}
                                    value={user.ageRange}
                                    updateFn={updateProfileField}
                                    options={ageRangeOptions}
                                    placeholder={t('profile.age_range_placeholder')}
                                    readOnly={isReadOnly}
                                />

                                <EditableSelectField
                                    name="conversationType"
                                    label={t('profile.conversation_type_label')}
                                    value={user.conversationType}
                                    updateFn={updateProfileField}
                                    options={conversationTypeOptions}
                                    placeholder={t('profile.conversation_type_placeholder')}
                                    readOnly={isReadOnly}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
