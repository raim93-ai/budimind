'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Clock, TrendingUp, ChevronDown } from 'lucide-react';
import AppShell from '@/components/AppShell';

interface AnswerItem { i: number; q: string; v: number; }
interface HistoryItem {
  id: number;
  assessment_type: string;
  raw_scores: string;
  severity: string | null;
  answers: string | null;
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
  const [data, setData] = useState<{
    patient: any;
    history: HistoryItem[];
    assignments: Assignment[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/portal/me')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('Please log in'))))
      .then(setData)
      .catch(() => { window.location.href = '/login'; })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--muted-foreground)]">Loading…</div>;
  }

  return (
    <AppShell
      brandSub="My wellbeing"
      nav={[
        { href: '/portal/me', label: 'Overview', icon: TrendingUp },
        { href: '/assessment', label: 'Take assessment', icon: ClipboardList },
      ]}
    >
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Hello, {data?.patient?.full_name ?? 'there'}
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

        {/* Quick action */}
        <section className="mb-10">
          <Link href="/assessment" className="washi-card p-6 no-underline flex items-start gap-4">
            <span className="h-10 w-10 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5 text-primary" />
            </span>
            <div>
              <div className="font-semibold">Take an assessment</div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Validated screenings for mood, anxiety, sleep, focus and more — about 5 minutes.
              </p>
            </div>
          </Link>
        </section>

        {/* History with per-question breakdown */}
        <section>
          <h2 className="font-semibold mb-4">Your history</h2>
          {!data?.history || data.history.length === 0 ? (
            <div className="washi-card p-10 text-center text-[var(--muted-foreground)]">
              No assessments yet. Take your first screening above — it takes about 5 minutes.
            </div>
          ) : (
            <div className="space-y-3">
              {data.history.map(h => {
                const scores = JSON.parse(h.raw_scores || '{}');
                const answers: AnswerItem[] = h.answers ? JSON.parse(h.answers) : [];
                const open = expanded === h.id;
                return (
                  <div key={h.id} className="washi-card overflow-hidden">
                    <div className="p-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="font-semibold uppercase text-sm">{h.assessment_type}</span>
                        <span className="text-xs text-[var(--muted-foreground)] ml-3">
                          {new Date(h.completed_at + 'Z').toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {h.severity && <span className="badge-soft">{h.severity}</span>}
                        <span className="text-sm font-semibold">Score {scores.total}</span>
                        {answers.length > 0 && (
                          <button
                            onClick={() => setExpanded(open ? null : h.id)}
                            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                          >
                            {answers.length} questions
                            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    {open && (
                      <div className="border-t border-[var(--border)] bg-[var(--muted)]/50 px-5 py-4">
                        {/* Subscales if present */}
                        {Object.entries(scores).filter(([k]) => !['total', 'severity', 'interpretation'].includes(k)).length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {Object.entries(scores)
                              .filter(([k]) => !['total', 'severity', 'interpretation'].includes(k))
                              .map(([k, v]) => (
                                <span key={k} className="badge-soft !bg-white capitalize">{k}: {String(v)}</span>
                              ))}
                          </div>
                        )}
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Your answers</p>
                        <ol className="space-y-2.5">
                          {answers.map(a => (
                            <li key={a.i} className="flex items-start justify-between gap-4 text-sm">
                              <span className="text-[var(--foreground)]">
                                <span className="text-[var(--muted-foreground)] mr-2">{a.i + 1}.</span>{a.q}
                              </span>
                              <span className={`shrink-0 px-2 py-0.5 rounded-md text-xs font-bold ${
                                a.v >= 2 ? 'bg-red-100 text-red-700' : a.v === 1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {a.v}
                              </span>
                            </li>
                          ))}
                        </ol>
                        {scores.interpretation && (
                          <p className="mt-4 text-sm text-[var(--muted-foreground)] italic">{scores.interpretation}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
