import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy notice',
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <PolicyPending
      title="Privacy notice"
      body="The production privacy notice is under Malaysian legal and privacy review. No account, booking, assessment or clinical-data collection is active on this pre-launch site."
    />
  );
}

function PolicyPending({ title, body }: { title: string; body: string }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-3xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">PRE-LAUNCH</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{body}</p>
        <p className="mt-8 border-l-2 border-amber-600 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Do not submit personal or clinical information through this website until the approved
          notice and secure collection service are published.
        </p>
      </div>
    </section>
  );
}
