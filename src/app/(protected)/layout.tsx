import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  // If no token, redirect to login
  if (!token) {
    redirect('/login');
  }
  
  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    // Clear invalid token and redirect to login
    cookieStore.delete('token');
    redirect('/login');
  }
  
  // Optionally, you can fetch consultant info and pass it to children
  // For now, we just render children if token is valid
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      {children}
    </div>
  );
}