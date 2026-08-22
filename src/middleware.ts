import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth-edge';

const protectedPaths = [
  '/dashboard',
  '/portal',
  '/api/patients',
  '/api/companies',
  '/api/assessments',
  '/api/dashboard',
  '/api/assignments',
];

const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/assessment',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/patient/lookup', // patient self-service lookup (issues scoped token)
];

// Role-scoped route prefixes: a user can only access prefixes allowed for their role
const roleScopes: Record<string, string[]> = {
  consultant: ['/dashboard'],
  company_admin: ['/dashboard/company', '/portal/company'],
  client: ['/portal/me'],
};

function roleAllowed(role: string | undefined, pathname: string): boolean {
  if (!role) return false;
  const scopes = roleScopes[role];
  if (!scopes) return false;
  return scopes.some(s => pathname === s || pathname.startsWith(s + '/'));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.next();
  }

  const isProtected = protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isPublic = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (isPublic && !isProtected) {
    return NextResponse.next();
  }

  if (isProtected) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);

    if (!payload) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Role-based scope enforcement
    if (!roleAllowed(payload.role as string | undefined, pathname)) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden for your role' }, { status: 403 });
      }
      // Send the user to their own home instead of a 403 page
      const homes: Record<string, string> = {
        consultant: '/dashboard',
        company_admin: '/dashboard/company',
        client: '/portal/me',
      };
      const home = homes[payload.role as string] ?? '/';
      return NextResponse.redirect(new URL(home, request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', String(payload.id));
    requestHeaders.set('x-user-email', String(payload.email));
    requestHeaders.set('x-user-name', String(payload.fullName ?? ''));
    requestHeaders.set('x-user-role', String(payload.role ?? ''));

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
