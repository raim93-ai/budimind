import type { Metadata } from 'next';
import Link from 'next/link';
import { CrisisSupport } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Psychology care, prepared with care',
  description:
    'BudiMind is preparing adult psychology services online and in Desa Melawati, Kuala Lumpur.',
};

export default function HomePage() {
  return (
    <>
      <section className="border-b border-stone-200 bg-[#f7f5ef] py-20 sm:py-28">
        <div className="container grid max-w-6xl gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-semibold tracking-wide text-teal-800">
              DESA MELAWATI · PRE-LAUNCH
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-6xl">
              A considered place to begin psychological care.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-650">
              BudiMind is preparing individual psychology sessions for adults, delivered online in
              Malaysia and in person at our forthcoming Kuala Lumpur centre.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                className="rounded-md bg-slate-950 px-5 py-3 font-medium text-white"
                href="/services"
              >
                Understand the service
              </Link>
              <Link
                className="rounded-md border border-slate-400 px-5 py-3 font-medium text-slate-900"
                href="/contact"
              >
                Register your interest
              </Link>
            </div>
          </div>
          <aside className="border-l-2 border-teal-700 pl-6 text-sm leading-6 text-slate-700">
            <p className="font-semibold text-slate-950">Opening planned for Q4 2026</p>
            <p className="mt-2">No. 15, Jalan 3/4C, Desa Melawati, Kuala Lumpur.</p>
            <p className="mt-4">
              Bookings are not yet open. No clinician is listed until credentials are verified.
            </p>
          </aside>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-10 border-b border-stone-200 pb-14 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-teal-800">01</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">Choose with evidence</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Profiles publish only after current registration, practising scope and indemnity are
                checked.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-800">02</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">Keep care independent</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Employers do not receive who books, attends, chooses a practitioner or enters
                treatment.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-800">03</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">Know the terms</h2>
              <p className="mt-3 leading-7 text-slate-600">
                A 50-minute individual session is RM250. Full policies are shown before booking and
                payment.
              </p>
            </div>
          </div>
          <div className="mt-14 max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              What the first service includes
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Individual psychological therapy or counselling for adults, subject to practitioner
              scope and clinical suitability. Formal autism assessment, couples/family work, group
              therapy and the Soul Reset programme are not part of the launch service.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl pb-16">
        <CrisisSupport />
      </div>
    </>
  );
}
