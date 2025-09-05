import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/signup'];

const SESSION_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/users/session`;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublicRoute = publicRoutes.includes(pathname);

    let isAuthenticated = false;
    try {
        const response = await fetch(SESSION_URL, {
            headers: request.headers,
        });

        if (response.ok) {
            isAuthenticated = true;
        }
    } catch (error) {
        console.error('Error al verificar la sesión:', error);
        isAuthenticated = false;
    }

    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/rooms', request.url));
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
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
