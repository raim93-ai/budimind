import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container max-w-3xl py-24">
      <p className="text-sm font-semibold tracking-wide text-teal-800">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Page not found</h1>
      <p className="mt-5 text-lg leading-8 text-slate-600">
        That page is not part of the BudiMind Clinic site.
      </p>
      <Link
        className="mt-8 inline-block font-semibold text-teal-800 underline underline-offset-4"
        href="/"
      >
        Return home
      </Link>
    </section>
  );
}
