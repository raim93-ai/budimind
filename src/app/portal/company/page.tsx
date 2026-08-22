'use client';

import { useEffect, useState } from 'react';
import { Building2, Users, Activity, ClipboardList, Plus, Copy, ShieldCheck, UserPlus, BarChart3 } from 'lucide-react';
import AppShell from '@/components/AppShell';

interface CompanyData {
  company: { id: number; name: string };
  headcount: number;
  participants: number;
  participationRate: number;
  riskIndex: number;
  totalResponses90d: number;
  severityMix: Array<{ assessment_type: string; severity: string | null; count: number }>;
  monthlyTrend: Array<{ month: string; responses: number; unique_participants: number }>;
}

interface Invite {
  code: string;
  role: string;
  is_active: number;
  created_at: string;
}

export default function CompanyPortal() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/portal/company').then(r => (r.ok ? r.json() : Promise.reject(new Error('login')))),
      fetch('/api/portal/company/invites').then(r => (r.ok ? r.json() : { invites: [] })),
    ])
      .then(([d, inv]) => { setData(d); setInvites(inv.invites ?? []); })
      .catch(() => { window.location.href = '/login'; })
      .finally(() => setLoading(false));
  }, []);

  const createInvite = async () => {
    const r = await fetch('/api/portal/company/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'client' }),
    });
    if (r.ok) {
      const { code } = await r.json();
      setNewCode(code);
      setInvites(prev => [{ code, role: 'client', is_active: 1, created_at: new Date().toISOString() }, ...prev]);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--muted-foreground)]">Loading…</div>;
  }

  const kpis = data ? [
    { icon: Users, label: 'Employees onboarded', value: data.headcount },
    { icon: Activity, label: 'Participation rate', value: `${data.participationRate}%` },
    { icon: ShieldCheck, label: 'Elevated-signal index*', value: `${data.riskIndex}%` },
    { icon: ClipboardList, label: 'Screenings (90 days)', value: data.totalResponses90d },
  ] : [];

  return (
    <AppShell
      brandSub={data?.company?.name ?? 'Corporate'}
      nav={[
        { href: '/portal/company', label: 'Wellbeing overview', icon: BarChart3 },
        { href: '/portal/company', label: 'Invites & people', icon: UserPlus },
        { href: '/assessment', label: 'Assessment library', icon: ClipboardList },
      ]}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Workforce wellbeing overview</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-8">
          Anonymized aggregates only — individual results are never visible to your organisation.
        </p>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map(k => (
            <div key={k.label} className="washi-card p-5">
              <k.icon className="h-4 w-4 text-primary mb-3" />
              <div className="text-2xl font-bold">{k.value}</div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Severity mix */}
          <div className="washi-card p-6">
            <h2 className="font-semibold mb-4">Screening signal mix (90 days)</h2>
            {!data?.severityMix?.length ? (
              <p className="text-sm text-[var(--muted-foreground)]">No screening data yet.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(
                  data.severityMix.reduce((acc, row) => {
                    const band = severityBand(row.severity);
                    acc[band] = (acc[band] ?? 0) + row.count;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([band, count]) => {
                  const total = data.severityMix.reduce((s, r) => s + r.count, 0);
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={band}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{band}</span><span className="text-[var(--muted-foreground)]">{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: bandColor(band) }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Monthly trend */}
          <div className="washi-card p-6">
            <h2 className="font-semibold mb-4">Participation trend</h2>
            {!data?.monthlyTrend?.length ? (
              <p className="text-sm text-[var(--muted-foreground)]">No activity yet.</p>
            ) : (
              <div className="flex items-end gap-3 h-40">
                {data.monthlyTrend.map(m => {
                  const max = Math.max(...data.monthlyTrend.map(x => x.responses));
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg bg-primary/80 transition-all hover:bg-primary" style={{ height: `${(m.responses / max) * 100}%` }} title={`${m.responses} responses`} />
                      <span className="text-[10px] text-[var(--muted-foreground)]">{m.month.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Invites */}
        <div className="washi-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Employee invites</h2>
            <button onClick={createInvite} className="button !py-2 !px-4 text-sm">
              <Plus className="inline h-4 w-4 mr-1.5 -mt-0.5" /> Generate invite code
            </button>
          </div>

          {newCode && (
            <div className="mb-4 rounded-lg bg-[var(--primary-soft)] border border-primary/20 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-[var(--muted-foreground)]">Share this code — employees enter it at signup:</div>
                <div className="font-mono font-bold text-lg mt-1">{newCode}</div>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(newCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="button-secondary !py-2 !px-3 text-xs">
                <Copy className="inline h-3.5 w-3.5 mr-1 -mt-0.5" /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}

          {invites.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No invite codes yet. Generate one to onboard your team.</p>
          ) : (
            <div className="space-y-2">
              {invites.map((inv, i) => (
                <div key={inv.code + i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0 text-sm">
                  <code className="font-mono">{inv.code}</code>
                  <span className={inv.is_active ? 'badge-soft' : 'text-[var(--muted-foreground)] text-xs'}>
                    {inv.is_active ? 'Active' : 'Used'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-xs text-[var(--muted-foreground)] flex items-start gap-1.5">
          <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          Elevated-signal index = share of recent screenings in clinically elevated bands. Programme-level trends only — never individual identities.
        </p>
      </div>
    </AppShell>
  );
}

function severityBand(severity: string | null): string {
  if (!severity) return 'Unclassified';
  const s = severity.toLowerCase();
  if (s.includes('normal') || s.includes('minimal') || s.includes('low') || s.includes('none')) return 'Healthy range';
  if (s.includes('mild') || s.includes('slight')) return 'Mild';
  if (s.includes('moderate')) return 'Moderate';
  if (s.includes('severe') || s.includes('high') || s.includes('extreme') || s.includes('probable')) return 'Elevated';
  return 'Other';
}

function bandColor(band: string): string {
  switch (band) {
    case 'Healthy range': return '#1E8E5A';
    case 'Mild': return '#C77D1F';
    case 'Moderate': return '#D98E48';
    case 'Elevated': return '#C0392B';
    default: return '#5B7185';
  }
}
