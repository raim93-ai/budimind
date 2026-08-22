import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-edge';

// Lightweight session probe for client components
export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader.match(/token=([^;]+)/)?.[1];
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    role: payload.role,
    fullName: payload.fullName,
    patientId: payload.patientId ?? null,
  });
}
