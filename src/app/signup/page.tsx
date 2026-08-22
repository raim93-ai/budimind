'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import { Suspense } from 'react';
import { Input } from '@/components/ui/input';

function SignupFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState(searchParams.get('invite') ?? '');
  const [showInvite, setShowInvite] = useState(!!searchParams.get('invite'));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          ...(inviteCode.trim() ? { inviteCode: inviteCode.trim() } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      router.push(data.redirectTo ?? '/portal/me');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8 no-underline">
        <span className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </span>
        <span className="text-2xl font-bold tracking-tight">Budimind</span>
      </Link>

      <div className="w-full max-w-md washi-card p-8">
        <h1 className="text-xl font-bold text-center mb-1">Create your account</h1>
        <p className="text-sm text-[var(--muted-foreground)] text-center mb-7">
          Free and confidential. Take validated screenings and track your wellbeing over time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full name</label>
            <Input id="fullName" type="text" required minLength={2} value={fullName}
              onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label>
            <Input id="email" type="email" autoComplete="email" required value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
          </div>

          {!showInvite ? (
            <button type="button" onClick={() => setShowInvite(true)}
              className="text-sm text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">
              I have a company invite code
            </button>
          ) : (
            <div>
              <label htmlFor="invite" className="block text-sm font-medium mb-2">Company invite code</label>
              <Input id="invite" type="text" value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)} placeholder="e.g. ACME-WELL-2026" />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="button w-full disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--muted-foreground)]">Loading…</div>}>
      <SignupFormInner />
    </Suspense>
  );
}
