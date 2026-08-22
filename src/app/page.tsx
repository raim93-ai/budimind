'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Brain, ShieldCheck, LineChart, ClipboardList, Users, Lock,
  ArrowRight, CheckCircle2, Menu, X, Building2, HeartPulse, Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: ClipboardList,
    title: '17 Validated Assessments',
    text: 'DASS-21, PHQ-9, GAD-7, PCL-5, WHO-5, EPDS, K10, ASRS, ISI and more — every instrument auto-scored with clinical severity bands and interpretation.',
  },
  {
    icon: Users,
    title: 'Corporate & EAP Ready',
    text: 'Manage multiple companies, departments and teams. Aggregate dashboards show workforce wellbeing at a glance without exposing individual PHI.',
  },
  {
    icon: LineChart,
    title: 'Longitudinal Tracking',
    text: 'Every response is time-stamped. Trend charts reveal whether interventions are working — per patient, per team, per company.',
  },
  {
    icon: SpiderIcon,
    title: 'Multi-Dimensional Profiles',
    text: 'Radar charts map depression, anxiety, stress, sleep and cognition on one canvas so patterns jump out immediately.',
  },
  {
    icon: ShieldCheck,
    title: 'HIPAA-Aligned Security',
    text: 'JWT auth in httpOnly cookies, role-scoped access, audit logging of every sensitive operation, and company-level data isolation.',
  },
  {
    icon: HeartPulse,
    title: 'Patient Self-Service',
    text: 'Patients log in with an access code to view their own history and complete assessments remotely — no consultant bottleneck.',
  },
];

function SpiderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 22 8.5 18.5 20.5 5.5 20.5 2 8.5 12 2" />
      <polygon points="12 7 17 10.5 15 16.5 9 16.5 7 10.5 12 7" />
      <line x1="12" y1="2" x2="12" y2="7" /><line x1="22" y1="8.5" x2="17" y2="10.5" />
      <line x1="18.5" y1="20.5" x2="15" y2="16.5" /><line x1="5.5" y1="20.5" x2="9" y2="16.5" />
      <line x1="2" y1="8.5" x2="7" y2="10.5" />
    </svg>
  );
}

const steps = [
  { n: '01', title: 'Register the client', text: 'Consultants add a patient or import a corporate roster in seconds.' },
  { n: '02', title: 'Administer assessment', text: 'The patient completes a validated instrument online, at the clinic or from home.' },
  { n: '03', title: 'Instant scoring', text: 'Responses are scored automatically against published clinical cutoffs.' },
  { n: '04', title: 'Track & act', text: 'Trends, radar profiles and team heatmaps inform the care plan.' },
];

const assessmentHighlights = [
  { name: 'DASS-21', tag: 'Depression · Anxiety · Stress' },
  { name: 'PHQ-9', tag: 'Depression screening' },
  { name: 'GAD-7', tag: 'Generalised anxiety' },
  { name: 'PCL-5', tag: 'PTSD (DSM-5)' },
  { name: 'WHO-5', tag: 'Wellbeing index' },
  { name: 'ASRS v1.1', tag: 'Adult ADHD' },
  { name: 'ISI', tag: 'Insomnia severity' },
  { name: 'EPDS', tag: 'Perinatal depression' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/85 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-bold tracking-tight text-[var(--foreground)]">Budimind</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--muted-foreground)]">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#assessments" className="hover:text-primary transition-colors">Assessments</a>
            <a href="#how" className="hover:text-primary transition-colors">How it works</a>
            <Link href="/patient/login" className="hover:text-primary transition-colors">For Patients</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-primary hover:underline">Consultant login</Link>
            <Link href="/assessment" className="button !py-2 !px-4 text-sm">Start assessment</Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="md:hidden border-t border-[var(--border)] px-6 py-4 flex flex-col gap-4 bg-white">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#assessments" onClick={() => setMenuOpen(false)}>Assessments</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <Link href="/patient/login" onClick={() => setMenuOpen(false)}>For Patients</Link>
            <Link href="/login" className="button w-full">Consultant login</Link>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="hero-gradient">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <span className="badge-soft"><Sparkles className="h-3.5 w-3.5" /> Clinical-grade psychometrics, delivered simply</span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] max-w-3xl mx-auto">
            Measure the mind.<br />
            <span className="text-primary">Guide the treatment.</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            Budimind gives clinics and workplace mental-health programmes scientifically validated
            assessments, instant scoring, and longitudinal analytics — in one calm, secure platform.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="button text-base">
              Take an assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="button-secondary text-base">Consultant login</Link>
          </div>
          <p className="mt-5 text-xs text-[var(--muted-foreground)]">
            Demo consultant: <code className="px-1.5 py-0.5 bg-[var(--muted)] rounded">consultant@budimind.com / password123</code>
          </p>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl mx-auto">
            {[['17+', 'Validated instruments'], ['100%', 'Auto-scored'], ['0', 'Spreadsheets needed']].map(([v, l]) => (
              <div key={l}>
                <div className="text-2xl sm:text-3xl font-bold text-primary">{v}</div>
                <div className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Why Budimind</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything a modern psychology practice needs
            </h2>
            <p className="mt-4 text-[var(--muted-foreground)]">
              From individual therapy to nationwide employee-assistance programmes.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="washi-card p-7">
                <div className="h-11 w-11 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center mb-5">
                  <Icon className="h-5.5 w-5.5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessments */}
      <section id="assessments" className="py-20 bg-white border-y border-[var(--border)] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="section-label">The library</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Validated instruments, zero manual scoring</h2>
              <p className="mt-4 text-[var(--muted-foreground)]">
                Every assessment ships with its full question set, subscale scoring and published
                severity interpretation — ready out of the box.
              </p>
            </div>
            <Link href="/assessment" className="button whitespace-nowrap self-start">
              Browse all 17 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {assessmentHighlights.map(a => (
              <Link key={a.name} href="/assessment" className="washi-card p-5 no-underline group">
                <div className="font-bold text-primary">{a.name}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1">{a.tag}</div>
                <ArrowRight className="h-4 w-4 mt-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-label">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">From intake to insight in four steps</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(s => (
              <div key={s.n} className="relative washi-card p-7 pt-9">
                <span className="absolute -top-4 left-7 h-9 w-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {s.n}
                </span>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-16 bg-[#16232E] text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <ShieldCheck className="h-8 w-8 text-[#7FC4BF] mb-4" />
            <h3 className="font-semibold text-lg mb-2">Security by design</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              httpOnly JWT sessions, bcrypt-hashed credentials, middleware-enforced route protection
              and a full audit trail of sensitive operations.
            </p>
          </div>
          <div>
            <Building2 className="h-8 w-8 text-[#7FC4BF] mb-4" />
            <h3 className="font-semibold text-lg mb-2">Built for organisations</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Company-scoped data isolation means HR sees workforce trends; consultants see patients.
              Nobody sees what they shouldn&apos;t.
            </p>
          </div>
          <div>
            <Lock className="h-8 w-8 text-[#7FC4BF] mb-4" />
            <h3 className="font-semibold text-lg mb-2">Data you can trust</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Foreign-key integrity, parameterised queries, and HIPAA-aligned safeguards documented
              in a living compliance checklist.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 hero-gradient">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to see your clients clearly?
          </h2>
          <p className="mt-4 text-[var(--muted-foreground)] text-lg">
            Start with a free screening assessment right now — no account required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="button-accent button text-base">
              Start free assessment <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="button-secondary !border-transparent bg-white text-base shadow-sm">
              Explore the consultant dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--border)] bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span>© {new Date().getFullYear()} Budimind · Psychology Clinic Platform</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/assessment" className="hover:text-primary">Assessments</Link>
            <Link href="/login" className="hover:text-primary">Consultants</Link>
            <Link href="/patient/login" className="hover:text-primary">Patients</Link>
          </nav>
        </div>
        <p className="max-w-6xl mx-auto px-6 mt-6 text-xs text-[var(--muted-foreground)]/70 text-center">
          Screening tools on this platform support — but never replace — professional clinical judgement.
          If you are in crisis, contact your local emergency services or Befrienders KL (+60 3-7627 2929).
        </p>
      </footer>
    </div>
  );
}

function Check() { return <CheckCircle2 className="h-4 w-4 text-success" />; }
void Check;
