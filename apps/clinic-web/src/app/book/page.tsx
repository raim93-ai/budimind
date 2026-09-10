import type { Metadata } from 'next';
import { Section, CTASection, EvidenceDisclaimer } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Book an Appointment | BudiMind Clinic',
  description:
    'Book a confidential session with a verified clinical psychologist. Choose online or in-person at our Shah Alam or Subang Jaya clinics.',
  alternates: { canonical: 'https://clinic.budimind.com/book' },
};

export default function BookPage() {
  return (
    <>
      <Section
        title="Book a Confidential Session"
        subtitle="Select your clinician and time slot. Sessions are available online or in-person."
        center
      >
        <div className="max-w-lg mx-auto">
          <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-secondary mb-4">
              Booking is completed through our secure scheduler. For a quick, no-obligation match we
              recommend starting with a consultation.
            </p>
            <a
              href="/psychologists"
              className="inline-block w-full px-6 py-3 bg-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity text-center"
            >
              Find a Psychologist First
            </a>
          </div>
        </div>
      </Section>

      {/* Evidence-based disclaimer on booking page */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer />
        </div>
      </Section>

      <CTASection
        title="Need help booking?"
        description="Email us or call and we'll arrange a session at your convenience."
        actions={[
          { label: 'Contact Us', href: '/contact' },
          { label: 'View Pricing', href: '/pricing', variant: 'secondary' },
        ]}
      />
    </>
  );
}
