import Link from 'next/link';

type ServiceStateProps = {
  kind: 'maintenance' | 'session-expired';
  homeHref?: string;
};

export function ServiceState({ kind, homeHref = '/' }: ServiceStateProps) {
  const maintenance = kind === 'maintenance';
  return (
    <section className="container max-w-2xl py-24" aria-labelledby="service-state-title">
      <p className="text-sm font-semibold tracking-wide text-teal-800">
        {maintenance ? 'SERVICE STATUS' : 'SESSION STATUS'}
      </p>
      <h1
        id="service-state-title"
        className="mt-4 text-4xl font-semibold tracking-tight text-slate-950"
      >
        {maintenance ? 'This service is temporarily paused' : 'Your session has ended'}
      </h1>
      <p className="mt-5 text-lg leading-8 text-slate-600">
        {maintenance
          ? 'We are completing planned work. Please return shortly; no action is needed from you.'
          : 'For your security, sign in again to continue. Unsaved information was not submitted.'}
      </p>
      <Link
        className="mt-8 inline-flex rounded-md bg-slate-950 px-5 py-3 font-medium text-white focus-visible:outline"
        href={homeHref}
      >
        Return home
      </Link>
    </section>
  );
}
