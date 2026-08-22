import { getDb } from '@/lib/db';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { LayoutDashboard, Users, ClipboardList, Building2, TrendingUp, UserPlus } from 'lucide-react';

export default async function DashboardPage() {
  const db = getDb();
  
  // Get stats
  const totalPatients = (db.prepare('SELECT COUNT(*) as count FROM patients').get() as { count: number }).count;
  const totalAssessments = (db.prepare('SELECT COUNT(*) as count FROM assessment_responses').get() as { count: number }).count;
  const totalCompanies = (db.prepare('SELECT COUNT(*) as count FROM companies').get() as { count: number }).count;
  
  // Recent assessments (last 7 days)
  const recentAssessments = db.prepare(`
    SELECT ar.*, p.full_name as patient_name
    FROM assessment_responses ar
    JOIN patients p ON ar.patient_id = p.id
    WHERE ar.completed_at >= date('now', '-7 days')
    ORDER BY ar.completed_at DESC
    LIMIT 5
  `).all() as any[];
  
  // Assessments by type (last 30 days)
  const assessmentsByType = db.prepare(`
    SELECT 
      ar.assessment_type,
      COUNT(*) as count
    FROM assessment_responses ar
    WHERE ar.completed_at >= date('now', '-30 days')
    GROUP BY ar.assessment_type
    ORDER BY count DESC
  `).all() as Array<{ assessment_type: string; count: number }>;

  return (
    <AppShell
      brandSub="Practitioner"
      nav={[
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/patients', label: 'Patients', icon: Users },
        { href: '/dashboard/patients/new', label: 'Register patient', icon: UserPlus },
        { href: '/assessment', label: 'Assessment library', icon: ClipboardList },
        { href: '/dashboard/trends', label: 'Trends', icon: TrendingUp },
        { href: '/dashboard/company', label: 'Corporate view', icon: Building2 },
      ]}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Practice overview</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-8">Your caseload at a glance.</p>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total patients', value: totalPatients, href: '/dashboard/patients' },
            { label: 'Assessments completed', value: totalAssessments, href: '/dashboard/trends' },
            { label: 'Companies served', value: totalCompanies, href: '/dashboard/company' },
          ].map(k => (
            <Link key={k.label} href={k.href} className="washi-card p-6 no-underline block">
              <div className="text-3xl font-bold text-primary">{k.value}</div>
              <div className="text-sm text-[var(--muted-foreground)] mt-1">{k.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent activity */}
          <div className="washi-card p-6">
            <h2 className="font-semibold mb-4">Recent assessments</h2>
            {recentAssessments.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No assessments in the last 7 days.</p>
            ) : (
              <div className="space-y-3">
                {recentAssessments.map((a: any) => (
                  <Link key={a.id} href={`/dashboard/patients/${a.patient_id}`}
                    className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0 no-underline group">
                    <div>
                      <span className="text-sm font-medium text-[var(--foreground)]">{a.patient_name}</span>
                      <span className="block text-xs text-[var(--muted-foreground)]">
                        {a.assessment_type.toUpperCase()} · {new Date(a.completed_at + 'Z').toLocaleDateString()}
                      </span>
                    </div>
                    <span className="badge-soft group-hover:bg-primary group-hover:text-white transition-colors">{a.severity ?? '—'}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* By type */}
          <div className="washi-card p-6">
            <h2 className="font-semibold mb-4">Assessments by type (30 days)</h2>
            {assessmentsByType.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {assessmentsByType.map(t => {
                  const max = Math.max(...assessmentsByType.map(x => x.count));
                  return (
                    <div key={t.assessment_type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="uppercase font-medium">{t.assessment_type}</span>
                        <span className="text-[var(--muted-foreground)]">{t.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--muted)] overflow-hidden">
                        <div className="h-full rounded-full bg-primary/80" style={{ width: `${(t.count / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
