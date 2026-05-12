// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Filter to ensure it mostly runs on page loads, not every image/icon
    const isPageRequest = !pathname.includes('.') && !pathname.startsWith('/_next');

    if (isPageRequest) {
        console.log(`🚀 [Middleware] Page Load: ${pathname}. Waking up Render backend...`);

        // Fire-and-forget fetch to your Render health check
        fetch(process.env.NEXT_PING_BACKEND_URL!)
            .then(() => {
                console.log('✅ [Middleware] Backend ping successful.');
            })
            .catch((err) => {
                console.error('❌ [Middleware] Backend ping failed:', err.message);
            });
    }

    return NextResponse.next();
}

// Ensure the middleware runs on all routes except static assets
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};