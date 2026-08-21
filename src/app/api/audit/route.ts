import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { logAuditEvent } from '@/lib/trends';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, resourceType, resourceId, details } = body;

    // Extract token from cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);

    // Verify token
    if (!tokenMatch) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const { verifyToken } = await import('@/lib/auth-edge');
    const payload = await verifyToken(tokenMatch[1]);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 },
      );
    }

    // Log the audit event
    await logAuditEvent({
      userId: payload.userId || payload.id,
      userType: payload.userType || 'consultant',
      action: action || 'view',
      resourceType: resourceType || 'unknown',
      resourceId: resourceId,
      ipAddress:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        null,
      userAgent: request.headers.get('user-agent') || null,
      details: details ? JSON.stringify(details) : null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Audit log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
