import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Protected paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/api/patients',
  '/api/companies',
  '/api/assessments',
  '/api/dashboard',
];

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/assessment',
  '/api/auth/login',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isPublic = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (isPublic) {
    return NextResponse.next();
  }

  if (isProtected) {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Redirect to login for page routes, return 401 for API routes
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 },
        );
      }

      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      // Invalid token - clear cookie and redirect
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Add user headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id.toString());
    requestHeaders.set('x-user-email', payload.email);
    requestHeaders.set('x-user-name', payload.fullName);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};