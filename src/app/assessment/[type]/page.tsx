'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Brain, AlertCircle } from 'lucide-react';
import { assessments } from '@/db/assessments';

// Per-instrument response scales (value = index submitted to scoringFn).
// These match the cutoffs in src/db/assessments/assessments.ts scoring functions.
const SCALE_LABELS: Record<string, string[]> = {
  dass21: ['Did not apply to me at all', 'Applied to some degree', 'Applied to a considerable degree', 'Applied very much'],
  phq9: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  gad7: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
  who5: ['At no time', 'Some of the time', 'Less than half the time', 'More than half the time', 'Most of the time', 'All of the time'],
  pcl5: ['Not at all', 'A little bit', 'Moderately', 'Quite a bit', 'Extremely'],
  epds: ['Never', 'Rarely', 'Sometimes', 'Most of the time'],
  k10: ['None of the time', 'A little of the time', 'Some of the time', 'Most of the time', 'All of the time'],
  asrs: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often'],
  isi: ['Not at all', 'Slightly', 'Somewhat', 'Much', 'Very much'],
  bai: ['Not at all', 'Mildly — it bothered me', 'Moderately — unpleasant at times', 'Severely — it bothered me a lot'],
  ybocs: ['None', 'Mild', 'Moderate', 'Severe', 'Extreme'],
  whodas2: ['No difficulty', 'Mild difficulty', 'Moderate difficulty', 'Severe difficulty', 'Extreme difficulty / cannot do'],
  coreom: ['Not at all', 'Only occasionally', 'Sometimes', 'Often', 'Most or all of the time'],
};
const FALLBACK_SCALE = ['Not at all', 'A little', 'Moderately', 'Quite a lot', 'Extremely'];

export default function AssessmentFormPage() {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const assessment = (assessments as any)[type];

  // 0 = intro/demographics (skipped for logged-in clients), 1..N = questions
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionRole, setSessionRole] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d?.role) setSessionRole(d.role); })
      .catch(() => {})
      .finally(() => setSessionChecked(true));
  }, []);

  if (!assessment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="washi-card p-8 text-center">
          <AlertCircle className="h-8 w-8 text-warning mx-auto mb-3" />
          <h1 className="text-xl font-bold mb-2">Assessment not found</h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-5">
            &ldquo;{type}&rdquo; isn&apos;t in the library.
          </p>
          <Link href="/assessment" className="button">Back to all assessments</Link>
        </div>
      </div>
    );
  }

  if (!sessionChecked) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--muted-foreground)]">Loading…</div>;
  }

  const isClient = sessionRole === 'client';
  const totalQuestions = assessment.questions.length;
  const questionIndex = step - 1; // 0-based into questions[]
  const currentAnswered = step === 0 || responses[questionIndex] !== undefined;
  const isLastQuestion = step === totalQuestions;

  // Intro/demographics gate for anonymous users
  const showDemographics = step === 0 && !isClient;
  const showIntro = step === 0 && isClient;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const orderedResponses = Array.from({ length: totalQuestions }, (_, i) => responses[i] ?? 0);
      const payload = {
        patientInfo: {
          fullName: (document.getElementById('fullName') as HTMLInputElement)?.value || 'Anonymous',
          email: (document.getElementById('email') as HTMLInputElement)?.value || null,
          age: parseInt((document.getElementById('age') as HTMLInputElement)?.value ?? '') || null,
          gender: (document.getElementById('gender') as HTMLSelectElement)?.value || null,
        },
        assessmentType: type,
        responses: orderedResponses,
      };
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      router.push(`/assessment/${type}/result?patientId=${data.patientId}&assessmentId=${data.assessmentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  const next = () => {
    if (isLastQuestion) { submit(); return; }
    setStep(s => s + 1);
  };

  const scale = SCALE_LABELS[type] ?? FALLBACK_SCALE;
  const question = step > 0 ? assessment.questions[questionIndex] : null;
  const progressPct = Math.round(((showDemographics || showIntro ? 0 : step) / totalQuestions) * 100);

  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-[var(--border)] bg-white/70 backdrop-blur sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/assessment" className="flex items-center gap-2 no-underline text-sm font-medium text-[var(--muted-foreground)] hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Exit
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm">{assessment.title}</span>
          </div>
          <span className="text-xs text-[var(--muted-foreground)] tabular-nums">
            {step === 0 ? 'Start' : `${step} / ${totalQuestions}`}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-[var(--muted)]">
          <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center py-10 px-6">
        <div className="max-w-2xl mx-auto w-full">

          {/* ---------- Step 0a: intro for logged-in clients ---------- */}
          {showIntro && (
            <div className="animate-fade-up">
              <p className="section-label">{assessment.title}</p>
              <h1 className="text-3xl font-bold tracking-tight leading-tight mb-5">{assessment.description}</h1>
              <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">{assessment.instructions}</p>
              <div className="washi-card p-5 mb-8 flex items-start gap-3">
                <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--muted-foreground)]">
                  <strong className="text-[var(--foreground)]">{totalQuestions} questions · about {Math.max(1, Math.ceil(totalQuestions * 0.25))} minutes.</strong>{' '}
                  Your answers save automatically to your account and remain private to you.
                </p>
              </div>
              <button onClick={next} disabled={!currentAnswered} className="button w-full sm:w-auto text-base disabled:opacity-50">
                Begin <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ---------- Step 0b: demographics for anonymous users ---------- */}
          {showDemographics && (
            <form
              onSubmit={(e) => { e.preventDefault(); next(); }}
              className="animate-fade-up"
            >
              <p className="section-label">Before we begin</p>
              <h1 className="text-3xl font-bold tracking-tight leading-tight mb-2">{assessment.description}</h1>
              <p className="text-sm text-[var(--muted-foreground)] mb-7">{assessment.instructions}</p>

              <div className="washi-card p-6 space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">Your name <span className="text-destructive">*</span></label>
                  <input id="fullName" required maxLength={80} placeholder="e.g. Alex Tan"
                    className="w-full rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email <span className="text-[var(--muted-foreground)] font-normal">(to find your results later)</span></label>
                  <input id="email" type="email" placeholder="you@example.com"
                    className="w-full rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium mb-1.5">Age</label>
                    <input id="age" type="number" min={1} max={120} placeholder="—"
                      className="w-full rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-1.5">Gender</label>
                    <select id="gender" className="w-full rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors">
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="button w-full sm:w-auto mt-6 text-base">
                Begin assessment <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* ---------- Questions ---------- */}
          {step > 0 && question && (
            <div key={questionIndex} className="animate-fade-up">
              <p className="text-sm font-semibold text-primary mb-3">
                Question {step} of {totalQuestions}
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-2">
                {question.text}
              </h1>
              {question.alternative_texts ? (
                <p className="text-sm text-[var(--muted-foreground)] mb-7">Choose the statement that best describes you.</p>
              ) : (
                <p className="text-sm text-[var(--muted-foreground)] mb-7">Select one answer.</p>
              )}

              <div className="space-y-2.5">
                {(question.alternative_texts ?? scale).map((option: string, value: number) => {
                  const selected = responses[questionIndex] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setResponses(prev => ({ ...prev, [questionIndex]: value }))}
                      className={`washi-card !transform-none w-full text-left px-5 py-4 flex items-center gap-4 transition-all duration-150 ${
                        selected
                          ? '!border-primary ring-2 ring-primary/25 shadow-md'
                          : 'hover:!border-primary/40'
                      }`}
                    >
                      <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selected ? 'border-primary bg-primary' : 'border-[var(--border)]'
                      }`}>
                        {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </span>
                      {!question.alternative_texts && (
                        <span className={`text-xs font-bold tabular-nums ${selected ? 'text-primary' : 'text-[var(--muted-foreground)]'}`}>
                          {value}
                        </span>
                      )}
                      <span className={`text-[15px] leading-snug ${selected ? 'font-medium' : ''}`}>{option}</span>
                    </button>
                  );
                })}
              </div>

              {error && (
                <div className="mt-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setStep(s => Math.max(isClient ? 1 : 0, s - 1))}
                  disabled={step <= (isClient ? 1 : 0)}
                  className="button-secondary !min-h-[44px] disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={next}
                  disabled={!currentAnswered || submitting}
                  className="button !min-h-[48px] !px-7 text-base disabled:opacity-45"
                >
                  {submitting ? 'Scoring…'
                    : isLastQuestion ? 'Submit & see results'
                    : <>Next <ArrowRight className="h-4 w-4" /></>}
                </button>
              </div>

              <p className="text-xs text-[var(--muted-foreground)]/80 text-center mt-8">
                No right or wrong answers — respond based on how you&apos;ve been feeling recently.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
