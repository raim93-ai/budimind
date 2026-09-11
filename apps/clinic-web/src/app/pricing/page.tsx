import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'BudiMind individual session pricing.',
};

const offers = [
  ['Single session', 'RM250', 'One 50-minute individual appointment.'],
  ['Five sessions', 'RM1,250', 'Use within six months after the first session.'],
  ['Ten sessions', 'RM2,500', 'Use within twelve months after the first session.'],
] as const;

export default function PricingPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-5xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">INDIVIDUAL CARE</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Simple pricing, before you commit.
        </h1>
        <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200">
          {offers.map(([name, price, detail]) => (
            <article className="grid gap-2 py-7 sm:grid-cols-[1fr_auto] sm:items-center" key={name}>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{name}</h2>
                <p className="mt-1 text-slate-600">{detail}</p>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950">{price}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 max-w-3xl text-sm leading-6 text-slate-600">
          <p>
            Founding-member prices are RM1,000 for five sessions and RM2,000 for ten sessions,
            subject to written eligibility, capacity, expiry and presale terms.
          </p>
          <p className="mt-4">
            Cancel or reschedule at least 24 hours before an appointment for a credit or eligible
            refund. Late cancellation and non-attendance normally use one credit, with emergency and
            clinical discretion exceptions. Exact tax and refund terms are shown before payment.
          </p>
        </div>
        <Link
          className="mt-8 inline-block rounded-md bg-slate-950 px-5 py-3 font-medium text-white"
          href="/contact"
        >
          Register your interest
        </Link>
      </div>
    </section>
  );
}
