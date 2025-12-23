import { UserProfile } from "@/src/app/profile/components/UserProfile";
import { Suspense } from "react";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pb-20">
            <div className="container mx-auto max-w-5xl pt-16 px-4">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center space-y-4 h-64">
                        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary animate-spin rounded-full" />
                        <p className="text-muted-foreground animate-pulse">Preparando tu perfil...</p>
                    </div>
                }>
                    <UserProfile />
                </Suspense>
            </div>
        </div>
    );
}