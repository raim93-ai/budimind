import type { Metadata } from 'next';
import { Section, CTASection, EvidenceDisclaimer, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'About Us | BudiMind Clinic',
  description:
    'BudiMind Clinic connects you with verified, licensed clinical psychologists for confidential, evidence-based care.',
  alternates: { canonical: 'https://clinic.budimind.com/about' },
};

export default function AboutPage() {
  return (
    <>
      <Section
        title="About BudiMind Clinic"
        subtitle="Confidential, evidence-based mental health support — online and in-person."
        center
      >
        <div className="max-w-3xl mx-auto space-y-6 text-secondary">
          <p>
            At BudiMind Clinic, we believe that quality mental health care should be accessible,
            confidential, and personal. We connect individuals and employer-supported employees with
            verified, licensed clinical psychologists who specialise in workplace stress, anxiety,
            relationships, and trauma recovery.
          </p>
          <p>
            Our platform lets you search by clinician, specialty, language, and availability — then
            book and attend securely online or at our Shah Alam and Subang Jaya clinics. Every
            interaction is designed with privacy first.
          </p>
          <p>
            Our assessments are grounded in validated psychological instruments and evidence-based
            practice. Learn more about the methodologies behind our work through authoritative
            sources like the{' '}
            <a
              href="https://www.apa.org/topics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              American Psychological Association
            </a>
            , the{' '}
            <a
              href="https://www.nimh.nih.gov/health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              National Institute of Mental Health
            </a>
            , and{' '}
            <a
              href="https://www.verywellmind.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Verywell Mind
            </a>{' '}
            — all referenced throughout our content for transparency and clinical grounding.
          </p>
        </div>
      </Section>

      <Section title="Our Clinics" center className="bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-6 text-center">
            <h3 className="font-semibold text-primary mb-2">Shah Alam</h3>
            <p className="text-sm text-secondary">
              Unit 12-03, Level 12, Wisma MPSJ, No. 1, Jalan Taman Sari, 46100 Petaling Jaya,
              Selangor.
            </p>
          </div>
          <div className="p-6 text-center">
            <h3 className="font-semibold text-primary mb-2">Subang Jaya</h3>
            <p className="text-sm text-secondary">
              Unit 21-05, USJ One, No. 3, Jalan USJ 9/3, 47120 Subang Jaya, Selangor.
            </p>
          </div>
        </div>
      </Section>

      {/* Psychological disclaimer */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer />
        </div>
      </Section>

      {/* Psychology resources */}
      <div className="container pb-12">
        <PsychologyResources />
      </div>

      <CTASection
        title="Start your wellbeing journey today."
        actions={[
          { label: 'Find a Psychologist', href: '/psychologists' },
          { label: 'Book an Appointment', href: '/book', variant: 'secondary' },
        ]}
      />
    </>
  );
}
