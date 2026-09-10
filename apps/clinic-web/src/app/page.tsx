import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Button,
  Section,
  FeatureGrid,
  CTASection,
  CrisisSupport,
  PsychologyResources,
  EvidenceDisclaimer,
} from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Professional Mental Health Support | BudiMind Clinic',
  description:
    'Verified clinical psychologists, flexible booking, and confidential care. Find your match and book online or in-person.',
  alternates: { canonical: 'https://clinic.budimind.com/' },
  openGraph: {
    title: 'Professional Mental Health Support | BudiMind Clinic',
    description: 'Verified clinical psychologists, flexible booking, and confidential care.',
  },
};

const features = [
  {
    title: 'Verified Psychologists',
    description:
      'Every clinician is licensed, vetted, and reviewed. Search by specialty, language, and availability.',
  },
  {
    title: 'Confidential & Secure',
    description:
      'End-to-end encryption, anonymous browsing, and HIPAA-aligned data handling you can trust.',
  },
  {
    title: 'Flexible Booking',
    description:
      'Book online or in-person sessions that fit your schedule, with or without employer benefits.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
            Professional Mental Health Support
          </h1>
          <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
            Verified clinical psychologists, flexible booking, and confidential care. Available for
            individuals and employer-supported employees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/psychologists" className="flex-1 sm:flex-none">
              <Button variant="primary" size="lg" className="w-full">
                Find a Psychologist
              </Button>
            </Link>
            <Link href="/book" className="flex-1 sm:flex-none">
              <Button variant="outline" size="lg" className="w-full">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Crisis Support Banner - above the fold */}
      <div className="container py-6">
        <CrisisSupport compact />
      </div>

      {/* Trust signals */}
      <section className="py-10 border-t border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
        <div className="container text-center">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">
            Trusted by individuals and employers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-70">
            <span className="text-sm font-medium">Licensed clinicians</span>
            <span className="text-sm">&middot;</span>
            <span className="text-sm font-medium">Flexible payment</span>
            <span className="text-sm">&middot;</span>
            <span className="text-sm font-medium">Employer benefits</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section
        title="Your Care, Your Terms"
        subtitle="Everything you need to start your mental health journey — safely, privately, and on your terms."
        center
      >
        <FeatureGrid features={features} />
      </Section>

      {/* How it works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/40">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4">
            How It Works
          </h2>
          <p className="text-center text-secondary max-w-2xl mx-auto mb-12">
            Getting the right support is a three-step journey.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h3 className="font-semibold text-primary mb-2">Search</h3>
              <p className="text-sm text-secondary">
                Find verified clinicians by specialty, language, location, and availability.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h3 className="font-semibold text-primary mb-2">Book</h3>
              <p className="text-sm text-secondary">
                Select a time slot, confirm details, and pay or use employer benefits.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h3 className="font-semibold text-primary mb-2">Attend</h3>
              <p className="text-sm text-secondary">
                Join your session online or in-person with secure, private care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Take the first step toward better wellbeing."
        description="Browse clinicians and book a confidential session today."
        actions={[
          { label: 'Find a Psychologist', href: '/psychologists' },
          { label: 'View Pricing', href: '/pricing', variant: 'secondary' },
        ]}
      />

      {/* Evidence-based disclaimer on the home page */}
      <div className="container py-6">
        <EvidenceDisclaimer />
      </div>

      {/* Psychology resources / further reading */}
      <div className="container pb-12">
        <PsychologyResources />
      </div>
    </>
  );
}
