import type { Metadata } from 'next';
import { CrisisSupport } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'BudiMind pre-launch contact information.',
};

export default function ContactPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-4xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">CONTACT</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          The centre is not accepting bookings yet.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          The previous prototype contained unverified phone numbers and email addresses, so they
          have been removed. Publish contact channels only after domain ownership and operational
          staffing are confirmed.
        </p>
        <address className="mt-10 border-l-2 border-teal-700 bg-stone-50 p-6 not-italic">
          <p className="font-semibold text-slate-950">Planned centre</p>
          <p className="mt-2 leading-7 text-slate-600">
            No. 15, Jalan 3/4C
            <br />
            Desa Melawati
            <br />
            Kuala Lumpur, Malaysia
          </p>
        </address>
        <div className="mt-12">
          <CrisisSupport />
        </div>
      </div>
    </section>
  );
}
