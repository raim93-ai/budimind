import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Extend NextRequest to include user property
declare module 'next/server' {
  interface NextRequest {
    user?: {
      id: number;
      email: string;
      fullName: string;
    };
  }
}

export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Get token from httpOnly cookie
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 },
    );
  }

  // Attach user to request for use in route handlers
  request.user = {
    id: payload.id,
    email: payload.email,
    fullName: payload.fullName,
  };

  return null; // No error, continue to handler
}

// Helper to get current user from request
export function getCurrentUser(request: NextRequest) {
  return request.user;
}