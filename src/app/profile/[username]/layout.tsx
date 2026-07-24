import { Metadata } from 'next';
import { APP_NAME } from '@/src/app/constants';

type Props = {
    params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;
    const decoded = decodeURIComponent(username);

    return {
        title: `${decoded}`,
        description: `Perfil público de ${decoded} en ${APP_NAME}. Conoce sus intereses y salas favoritas.`,
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default function UsernameLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
