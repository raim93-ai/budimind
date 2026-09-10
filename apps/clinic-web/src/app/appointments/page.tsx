import type { Metadata } from 'next';
import { Section, EvidenceDisclaimer, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'My Appointments | BudiMind Clinic',
  description: 'View and manage your booked appointments with verified clinical psychologists.',
  alternates: { canonical: 'https://clinic.budimind.com/appointments' },
};

export default function AppointmentsPage() {
  return (
    <>
      <Section
        title="My Appointments"
        subtitle="View and manage your upcoming sessions with verified clinicians."
        center
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-secondary mb-4">You have no upcoming appointments at this time.</p>
            <div className="mt-4">
              <a href="/book" className="text-primary hover:underline font-medium">
                Book an Appointment
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Evidence-based disclaimer */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer />
        </div>
      </Section>

      {/* Psychology resources */}
      <div className="container pb-12">
        <PsychologyResources
          title="Mental Health Resources"
          intro="While you wait for your appointment, these authoritative sources provide additional
          evidence-based information on mental health and wellness:"
        />
      </div>
    </>
  );
}
