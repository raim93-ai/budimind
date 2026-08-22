'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, ClipboardList, Clock, TrendingUp, LogOut } from 'lucide-react';

interface HistoryItem {
  id: number;
  assessment_type: string;
  raw_scores: string;
  severity: string | null;
  completed_at: string;
}

interface Assignment {
  id: number;
  assessment_type: string;
  status: string;
  due_at: string | null;
  assigned_by_name: string;
}

export default function ClientPortal() {
  const router = useRouter();
  const [data, setData] = useState<{
    patient: any;
    history: HistoryItem[];
    assignments: Assignment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/me')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('Please log in'))))
      .then(setData)
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--muted-foreground)]">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--background)]/85 border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </span>
            <span className="font-bold">Budimind</span>
          </Link>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-primary transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Hello, {data?.patient?.full_name ?? data?.patient?.email ?? 'there'}
        </h1>
        <p className="text-[var(--muted-foreground)] mb-8">Your personal wellbeing space. Everything here is private to you.</p>

        {/* Pending assignments */}
        {data?.assignments && data.assignments.length > 0 && (
          <section className="mb-10">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> Assigned to you</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.assignments.map(a => (
                <Link key={a.id} href={`/assessment/${a.assessment_type}`}
                  className="washi-card p-5 no-underline flex items-center justify-between group">
                  <div>
                    <div className="font-semibold text-primary uppercase text-sm">{a.assessment_type}</div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-1">
                      Assigned by {a.assigned_by_name}
                      {a.due_at ? ` · due ${new Date(a.due_at).toLocaleDateString()}` : ''}
                    </div>
                  </div>
                  <span className="button !py-2 !px-4 text-xs">Start</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Quick actions */}
        <section className="mb-10 grid gap-4 sm:grid-cols-2">
          <Link href="/assessment" className="washi-card p-6 no-underline flex items-start gap-4">
            <span className="h-10 w-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5 text-primary" />
            </span>
            <div>
              <div className="font-semibold">Take an assessment</div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Validated screenings for mood, anxiety, sleep, focus and more.
              </p>
            </div>
          </Link>
          <Link href="/assessment" className="washi-card p-6 no-underline flex items-start gap-4">
            <span className="h-10 w-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-primary" />
            </span>
            <div>
              <div className="font-semibold">Your progress</div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                See how your scores change over time below.
              </p>
            </div>
          </Link>
        </section>

        {/* History */}
        <section>
          <h2 className="font-semibold mb-4">Your history</h2>
          {!data?.history || data.history.length === 0 ? (
            <div className="washi-card p-10 text-center text-[var(--muted-foreground)]">
              No assessments yet. Take your first screening above — it takes about 5 minutes.
            </div>
          ) : (
            <div className="space-y-3">
              {data.history.map(h => (
                <div key={h.id} className="washi-card p-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold uppercase text-sm">{h.assessment_type}</span>
                    <span className="text-xs text-[var(--muted-foreground)] ml-3">
                      {new Date(h.completed_at + 'Z').toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {h.severity && (
                      <span className="badge-soft">{h.severity}</span>
                    )}
                    <Link href={`/assessment/${h.assessment_type}/result?responseId=${h.id}`}
                      className="text-sm font-semibold text-primary hover:underline">
                      View results
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
