import type { Metadata } from 'next';
import { Section, FeatureGrid, EvidenceDisclaimer, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Services | BudiMind Clinic',
  description:
    'Confidential mental health services for individuals and employer-supported employees. Online and in-person sessions.',
  alternates: { canonical: 'https://clinic.budimind.com/services' },
};

const services = [
  {
    title: 'Individual Therapy',
    description:
      'One-on-one sessions with a licensed psychologist for anxiety, depression, trauma, and more.',
  },
  {
    title: 'Couples Counselling',
    description: 'Strengthen relationships through guided, confidential communication sessions.',
  },
  {
    title: 'Employer Benefits',
    description: 'EAP-aligned programmes seamlessly integrated with your benefits provider.',
  },
  {
    title: 'Online Sessions',
    description: 'Secure video consultations from the comfort of your own space.',
  },
  {
    title: 'In-Person Care',
    description: 'Face-to-face support at our Shah Alam and Subang Jaya clinics.',
  },
  {
    title: 'Crisis Support',
    description: '24/7 access to crisis resources and urgent-care pathways when you need them.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section
        title="Our Services"
        subtitle="Confidential, evidence-based mental health support — online and in-person."
        center
      >
        <FeatureGrid features={services} />
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
          title="Learn More About Mental Health"
          intro="Our services are grounded in evidence-based psychological practice. These authoritative sources
          provide additional information on the conditions we treat and the approaches we use:"
        />
      </div>
    </>
  );
}
