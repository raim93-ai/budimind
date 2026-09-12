'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container max-w-3xl py-24" role="alert">
      <p className="text-sm font-semibold tracking-wide text-amber-700">TEMPORARILY UNAVAILABLE</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
        We could not load this page
      </h1>
      <p className="mt-5 text-lg leading-8 text-slate-600">
        Please try again, or return to the clinic home page.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button
          className="rounded-md bg-slate-950 px-5 py-3 font-medium text-white"
          onClick={reset}
        >
          Try again
        </button>
        <Link
          className="rounded-md border border-slate-400 px-5 py-3 font-medium text-slate-900"
          href="/"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
