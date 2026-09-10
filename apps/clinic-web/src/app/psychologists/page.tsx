import type { Metadata } from 'next';
import { Section, CTASection, EvidenceDisclaimer, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Our Psychologists | BudiMind Clinic',
  description:
    'Browse licensed clinical psychologists by specialty, language, location, and availability. Verified, confidential care.',
  alternates: { canonical: 'https://clinic.budimind.com/psychologists' },
};

const psychologists = [
  {
    name: 'Dr. Aisha Rahman',
    credentials: 'Clinical Psychologist, MMPI-2, CBT',
    specialties: ['Anxiety', 'Depression', 'Trauma'],
    bio: '10+ years supporting workplace stress and anxiety disorders.',
  },
  {
    name: 'Dr. Karan Singh',
    credentials: 'Counselling Psychologist, ACT, Mindfulness',
    specialties: ['Stress', 'Burnout', 'Relationships'],
    bio: 'Specialises in burnout recovery and work-life balance for professionals.',
  },
  {
    name: 'Dr. Mei Ling',
    credentials: 'Clinical Psychologist, DBT, Family Therapy',
    specialties: ['Family', 'Relationships', 'Depression'],
    bio: 'Focuses on family systems and relationship counselling, in-person and online.',
  },
];

export default function PsychologistsPage() {
  return (
    <>
      <Section
        title="Find a Psychologist"
        subtitle="Verified, licensed clinicians matched to your needs — confidential and secure."
        center
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {psychologists.map((p) => (
            <div
              key={p.name}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl text-primary font-bold">
                  {p.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-1">{p.name}</h3>
              <p className="text-sm text-secondary mb-2">{p.credentials}</p>
              <p className="text-xs text-secondary mb-3">{p.bio}</p>
              <p className="text-xs text-secondary">Specialties: {p.specialties.join(', ')}</p>
              <a href={`/book`} className="mt-4 text-sm font-medium text-primary hover:underline">
                Book a session →
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Evidence-based disclaimer for clinician listing */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer
            text="Our clinicians use validated psychological instruments and evidence-based approaches
          (e.g., CBT, DBT, ACT). These profiles are for informational purposes only and do not
          constitute a recommendation or endorsement. Always consult with a qualified professional
          for personal health decisions."
          />
        </div>
      </Section>

      {/* Psychology resources */}
      <div className="container pb-12">
        <PsychologyResources
          title="Verified Clinical Approaches"
          intro="Our psychologists are trained in evidence-based modalities. Learn more about these
          approaches from the following authoritative sources:"
        />
      </div>

      <CTASection
        title="Not sure which psychologist is right for you?"
        description="Share what you're looking for and we'll suggest the best match."
        actions={[{ label: 'Book a Consultation', href: '/book' }]}
      />
    </>
  );
}
