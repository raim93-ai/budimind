import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth-edge';
import ConsultantNavShell from './dashboard/ConsultantNavShell';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'consultant') {
    // Wrong role or bad token: send to their own home (or login)
    redirect(payload?.role === 'company_admin' ? '/portal/company'
      : payload?.role === 'client' ? '/portal/me' : '/login');
  }

  return <ConsultantNavShell>{children}</ConsultantNavShell>;
}
