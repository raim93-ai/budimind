'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Brain, ShieldCheck, LineChart, ClipboardList, Users, Lock,
  ArrowRight, Menu, X, Building2, HeartPulse, UserRound,
} from 'lucide-react';

// Surface: Decide/Learn — one idea per section; segmented hero for the 3 audiences.
const audiences = [
  {
    icon: UserRound,
    label: 'For yourself',
    headline: 'Understand your mind in 5 minutes',
    text: 'Take clinically validated screenings privately. Get instant results in plain language and track how you feel over time.',
    cta: { href: '/signup', text: 'Create free account' },
  },
  {
    icon: Building2,
    label: 'For your company',
    headline: 'See workforce wellbeing, not just sick notes',
    text: 'Onboard employees with invite codes, run screening programmes, and give HR anonymized aggregate insight — individual results stay private by design.',
    cta: { href: '/signup?invite=', text: 'Set up your programme' },
  },
  {
    icon: ClipboardList,
    label: 'For practitioners',
    headline: 'Assess, score and track without the paperwork',
    text: '17 validated instruments auto-scored against published cutoffs, longitudinal patient charts, and a corporate caseload view.',
    cta: { href: '/login', text: 'Consultant login' },
  },
];

const features = [
  {
    icon: ClipboardList,
    title: '17 validated assessments',
    text: 'DASS-21, PHQ-9, GAD-7, PCL-5, WHO-5, ASRS, ISI and more — every instrument auto-scored with clinical severity bands.',
  },
  {
    icon: LineChart,
    title: 'Longitudinal tracking',
    text: 'Every response is time-stamped. Trend charts show whether care plans and programmes actually work.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by architecture',
    text: 'Role-scoped access enforced in middleware. Company admins see aggregates only; consultants see patients. Nobody sees what they shouldn\u2019t.',
  },
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
            <a href="#who" className="hover:text-primary transition-colors">Who it&apos;s for</a>
            <a href="#features" className="hover:text-primary transition-colors">Platform</a>
            <a href="#assessments" className="hover:text-primary transition-colors">Assessments</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-primary hover:underline">Sign in</Link>
            <Link href="/signup" className="button !py-2 !px-4 text-sm">Get started free</Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="md:hidden border-t border-[var(--border)] px-6 py-4 flex flex-col gap-4 bg-white">
            <a href="#who" onClick={() => setMenuOpen(false)}>Who it&apos;s for</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="#assessments" onClick={() => setMenuOpen(false)}>Assessments</a>
            <Link href="/signup" onClick={() => setMenuOpen(false)} className="button w-full">Get started free</Link>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="hero-gradient">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08] max-w-3xl mx-auto">
            Mental health measurement,<br />
            <span className="text-primary">built for every kind of mind.</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
            One platform connecting individuals, workplaces and practitioners
            with scientifically validated psychological assessment.
          </p>
        </div>

        {/* Audience segmentation */}
        <div id="who" className="max-w-6xl mx-auto px-6 pb-20 grid gap-5 md:grid-cols-3 scroll-mt-20">
          {audiences.map(a => (
            <div key={a.label} className="washi-card p-7 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-9 w-9 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center">
                  <a.icon className="h-4.5 w-4.5 text-primary" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{a.label}</span>
              </div>
              <h2 className="font-semibold text-lg leading-snug mb-2">{a.headline}</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-5 flex-1">{a.text}</p>
              <Link href={a.cta.href} className="button-secondary !py-2.5 w-full justify-between group">
                {a.cta.text}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Platform features */}
      <section id="features" className="py-20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">The platform</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
              Clinical rigour, human experience
            </h2>
          </div>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.title} className="border-t-2 border-[var(--border)] pt-6">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-sm font-bold text-primary">0{i + 1}</span>
                  <f.icon className="h-4 w-4 text-[var(--muted-foreground)]" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment library */}
      <section id="assessments" className="py-20 bg-white border-y border-[var(--border)] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">The library</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
                Every instrument scored the moment it&apos;s submitted
              </h2>
            </div>
            <Link href="/assessment" className="button whitespace-nowrap self-start">
              Browse all 17 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
            {[
              ['DASS-21', 'Depression · Anxiety · Stress'],
              ['PHQ-9', 'Depression screening'],
              ['GAD-7', 'Generalised anxiety'],
              ['PCL-5', 'PTSD (DSM-5)'],
              ['WHO-5', 'Wellbeing index'],
              ['ASRS v1.1', 'Adult ADHD'],
              ['ISI', 'Insomnia severity'],
              ['EPDS', 'Perinatal depression'],
            ].map(([name, tag]) => (
              <Link key={name} href="/assessment" className="group border-b border-[var(--border)] pb-4 no-underline">
                <div className="font-bold text-primary">{name}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1">{tag}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy strip */}
      <section className="py-16 bg-[#16232E] text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <Lock className="h-7 w-7 text-[#7FC4BF] mb-4" />
            <h3 className="font-semibold text-lg mb-2">Your results are yours</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Personal clients own their data. Sharing with a practitioner is always an explicit choice.
            </p>
          </div>
          <div>
            <Users className="h-7 w-7 text-[#7FC4BF] mb-4" />
            <h3 className="font-semibold text-lg mb-2">HR sees patterns, not people</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Corporate dashboards expose anonymized aggregates only — enforced in code, not policy.
            </p>
          </div>
          <div>
            <HeartPulse className="h-7 w-7 text-[#7FC4BF] mb-4" />
            <h3 className="font-semibold text-lg mb-2">Clinical-grade foundations</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Audit logging, bcrypt credentials, httpOnly sessions, and HIPAA-aligned safeguards throughout.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 hero-gradient">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Start with a single question: how are you, really?
          </h2>
          <p className="mt-4 text-[var(--muted-foreground)] text-lg">
            Free, confidential, and backed by real psychometrics.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="button-accent button text-base">
              Take a free screening <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/signup" className="button-secondary !border-transparent bg-white text-base shadow-sm">
              Create an account
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
            <Link href="/signup" className="hover:text-primary">Individuals</Link>
            <Link href="/login" className="hover:text-primary">Sign in</Link>
          </nav>
        </div>
        <p className="max-w-6xl mx-auto px-6 mt-6 text-xs text-[var(--muted-foreground)]/70 text-center">
          Screening tools support — but never replace — professional clinical judgement. If you are in crisis,
          contact your local emergency services or Befrienders KL (+60 3-7627 2929).
        </p>
      </footer>
    </div>
  );
}
