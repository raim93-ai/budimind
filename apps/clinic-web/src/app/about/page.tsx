import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About BudiMind and its forthcoming Desa Melawati centre.',
};

export default function AboutPage() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-4xl">
        <p className="text-sm font-semibold tracking-wide text-teal-800">ABOUT BUDIMIND</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Independent psychological care and responsible workplace wellbeing.
        </h1>
        <div className="mt-10 max-w-3xl space-y-6 text-lg leading-8 text-slate-600">
          <p>
            BudiMind is a brand of Mafar Healthcare Sdn Bhd. Its public clinic and corporate
            wellbeing work share a purpose, but not unrestricted data.
          </p>
          <p>
            Employers may receive privacy-checked aggregate organisational insights. They do not
            receive who books, attends, chooses a practitioner, completes a clinical assessment or
            enters treatment.
          </p>
          <p>
            The first centre is planned at No. 15, Jalan 3/4C, Desa Melawati, Kuala Lumpur. Public
            booking begins only after the premises, practitioners, policies and systems have passed
            their launch gates.
          </p>
        </div>
      </div>
    </section>
  );
}
