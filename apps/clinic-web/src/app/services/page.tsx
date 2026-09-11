import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'BudiMind launch service scope.',
};

export default function ServicesPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-5xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">LAUNCH SCOPE</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Clear care boundaries from the start.
        </h1>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <article className="border-t border-slate-900 pt-5">
            <h2 className="text-xl font-semibold">Individual sessions</h2>
            <p className="mt-3 leading-7 text-slate-600">
              50-minute psychological therapy or counselling appointments for adults aged 18 and
              above, subject to practitioner competence and clinical suitability.
            </p>
          </article>
          <article className="border-t border-slate-900 pt-5">
            <h2 className="text-xl font-semibold">Online in Malaysia</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Secure video sessions for clients physically in Malaysia. Identity, consent, location,
              privacy and an emergency plan are checked.
            </p>
          </article>
          <article className="border-t border-slate-900 pt-5">
            <h2 className="text-xl font-semibold">Desa Melawati</h2>
            <p className="mt-3 leading-7 text-slate-600">
              In-person appointments are planned at No. 15, Jalan 3/4C, Desa Melawati, Kuala Lumpur,
              after the centre is operationally approved.
            </p>
          </article>
          <article className="border-t border-slate-900 pt-5">
            <h2 className="text-xl font-semibold">Not an emergency service</h2>
            <p className="mt-3 leading-7 text-slate-600">
              BudiMind does not provide emergency care, prescribing or crisis response. Call 999 for
              immediate danger or Talian HEAL at 15555.
            </p>
          </article>
        </div>
        <div className="mt-14 bg-stone-100 p-6">
          <h2 className="font-semibold text-slate-950">Not offered at launch</h2>
          <p className="mt-2 leading-7 text-slate-600">
            Minors, couples/family work, group therapy, formal autism assessment and Soul Reset
            require separate clinical governance before they can be offered.
          </p>
        </div>
      </div>
    </section>
  );
}
