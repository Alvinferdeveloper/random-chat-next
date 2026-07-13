import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/signup', '/verify-email', '/rooms', '/chat/[id]'];

const SESSION_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/users/session`;

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if it's a public profile route: /profile/username but NOT exactly /profile
    const isPublicProfile = pathname.startsWith('/profile/') && pathname !== '/profile';

    const isPublicRoute = publicRoutes.includes(pathname) ||
        pathname.startsWith('/chat/') ||
        isPublicProfile;

    let isAuthenticated = false;
    try {
        const headers = new Headers();

        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
            headers.append('Cookie', cookieHeader);
        }

        console.log(`[Middleware] Verificando ruta: ${pathname}. Cookies presentes:`, request.cookies.getAll().map(c => c.name));

        const userAgent = request.headers.get('user-agent');
        if (userAgent) headers.append('user-agent', userAgent);

        const response = await fetch(SESSION_URL, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            isAuthenticated = true;
        } else {
            console.log(`[Middleware] API respondió con estado: ${response.status} para la ruta ${pathname}`);
        }
    } catch (error) {
        console.error('Error al verificar la sesión:', error);
        isAuthenticated = false;
    }

    if (isPublicRoute && isAuthenticated) {
        if (pathname !== '/rooms' && !pathname.startsWith('/chat/') && !isPublicProfile) {
            return NextResponse.redirect(new URL('/rooms', request.url));
        }
    }

    if (!isPublicRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Coincidir con todas las rutas de petición excepto las siguientes:
         * - api (rutas de API del frontend)
         * - _next/static (archivos estáticos)
         * - _next/image (archivos de optimización de imágenes)
         * - favicon.ico (archivo de favicon)
         */
        '/((?!api|_next/static|_next/image|images|illustrations|favicon.ico).*)',
    ],
};
