import Link from 'next/link';
import { assessments } from '@/db/assessments';
import { ArrowRight, Clock, ListChecks } from 'lucide-react';

// Catalog metadata: what each instrument measures + its domain grouping
const CATALOG: Record<string, { domain: string; measures: string; minutes: number }> = {
  dass21: { domain: 'Mood', measures: 'Depression, anxiety & stress', minutes: 3 },
  phq9: { domain: 'Mood', measures: 'Depression severity', minutes: 2 },
  gad7: { domain: 'Anxiety', measures: 'Generalised anxiety', minutes: 2 },
  who5: { domain: 'Wellbeing', measures: 'Subjective well-being', minutes: 1 },
  pcl5: { domain: 'Trauma', measures: 'PTSD symptoms (DSM-5)', minutes: 5 },
  epds: { domain: 'Perinatal', measures: 'Perinatal depression', minutes: 3 },
  k10: { domain: 'Distress', measures: 'Psychological distress', minutes: 2 },
  asrs: { domain: 'Focus', measures: 'Adult ADHD screening', minutes: 2 },
  isi: { domain: 'Sleep', measures: 'Insomnia severity', minutes: 2 },
  bdi2: { domain: 'Mood', measures: 'Depression intensity', minutes: 5 },
  bai: { domain: 'Anxiety', measures: 'Anxiety intensity', minutes: 5 },
  ybocs: { domain: 'OCD', measures: 'Obsession & compulsion severity', minutes: 4 },
  whodas2: { domain: 'Functioning', measures: 'Daily-life functioning', minutes: 3 },
  coreom: { domain: 'Global', measures: 'Broad clinical outcomes', minutes: 6 },
};

const DOMAINS = [
  ['Mood', '#2A6F6C'], ['Anxiety', '#2276A8'], ['Wellbeing', '#1E8E5A'],
  ['Trauma', '#8A5A9E'], ['Sleep', '#3D5A80'], ['Focus', '#C77D1F'],
  ['Distress', '#B0563C'], ['Perinatal', '#A8577E'], ['OCD', '#5B7185'],
  ['Functioning', '#4E7A5A'], ['Global', '#5C6B78'],
] as const;

export default function AssessmentCatalogPage() {
  const list = Object.entries(assessments).map(([id, a]) => ({ id, ...(a as any) }));
  const known = list.filter(a => CATALOG[a.id]);
  const others = list.filter(a => !CATALOG[a.id]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Page head */}
      <header className="hero-gradient border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-12">
          <p className="section-label">Assessment library</p>
          <h1 className="text-4xl font-bold tracking-tight max-w-2xl leading-tight">
            {list.length} validated instruments. Zero manual scoring.
          </h1>
          <p className="mt-4 text-[var(--muted-foreground)] max-w-xl leading-relaxed">
            Every screening is scored instantly against published clinical cutoffs.
            Pick where you&apos;d like to start — most take under 5 minutes.
          </p>
          {/* Domain chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {DOMAINS.map(([name, color]) => (
              <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[var(--border)] px-3 py-1 text-xs font-medium">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {name}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...known, ...others].map(a => {
            const meta = CATALOG[a.id];
            const domainColor = DOMAINS.find(([n]) => n === meta?.domain)?.[1] ?? '#5B7185';
            return (
              <Link
                key={a.id}
                href={`/assessment/${a.id}`}
                className="washi-card p-6 no-underline flex flex-col group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white"
                    style={{ background: domainColor }}
                  >
                    {meta?.domain ?? 'Clinical'}
                  </span>
                  <span className="text-[11px] font-bold tracking-wide text-[var(--muted-foreground)]">
                    {a.title}
                  </span>
                </div>

                <h2 className="font-semibold text-lg leading-snug mb-1.5">{meta?.measures ?? a.description}</h2>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed flex-1">
                  {a.questions.length} questions
                </p>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--border)]">
                  <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                    <Clock className="h-3.5 w-3.5" /> ~{meta?.minutes ?? Math.ceil(a.questions.length * 0.25)} min
                    <span className="mx-1">·</span>
                    <ListChecks className="h-3.5 w-3.5" /> auto-scored
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                    Start
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
