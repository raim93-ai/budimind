import type { Metadata } from 'next';
import {
  Section,
  FeatureGrid,
  CTASection,
  EvidenceDisclaimer,
  PsychologyResources,
} from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Solutions | BudiMind Corporate',
  description:
    'Tailored workforce wellbeing solutions for HR, management, and employee assistance programs. Evidence-based interventions for every team.',
  openGraph: {
    title: 'Solutions | BudiMind Corporate',
    description:
      'Tailored workforce wellbeing solutions for HR, management, and employee assistance programs.',
  },
};

const solutions = [
  {
    title: 'HR & People Teams',
    description:
      'Aggregate retention-risk signals and programme ROI without ever seeing individual responses. Evidence-based reporting aligned with APA and NIMH guidelines on workplace mental health.',
  },
  {
    title: 'Management',
    description:
      'Privacy-safe team-level insights that help managers support their people. Built on validated psychological instruments and best practices from the field of occupational health psychology.',
  },
  {
    title: 'Employee Assistance Programs',
    description:
      'Integrated EAP workflows that connect employees with verified clinical psychologists when they are ready. References include guidelines from the American Psychological Association and World Health Organization on employee mental health.',
  },
  {
    title: 'Benefits & Compensation',
    description:
      'Quantify the ROI of wellbeing investments through privacy-released analytics. Benchmark against industry standards from mental health research and occupational health literature.',
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Section
        title="Solutions for Every Team"
        subtitle="Tailored workforce wellbeing solutions for HR, management, and employee assistance programs."
        center
      >
        <FeatureGrid features={solutions} />
      </Section>

      {/* Evidence-based disclaimer */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer
            text="BudiMind Corporate solutions are based on evidence-based psychological
          instruments and frameworks. They are designed to support organisational wellbeing
          initiatives and should not replace individual clinical assessment or treatment. Aggregate
          insights are de-identified and designed to preserve anonymity in line with GDPR, HIPAA,
          and local healthcare data regulations."
          />
        </div>
      </Section>

      {/* Psychology resources */}
      <div className="container pb-12">
        <PsychologyResources
          title="Referenced Standards & Resources"
          intro="Our solutions are grounded in evidence-based psychology and reference these
          authoritative sources:"
        />
      </div>

      <CTASection
        title="Ready to get started?"
        description="Talk to our team for a free, no-obligation consultation."
        actions={[{ label: 'Contact Us', href: '/contact' }]}
      />
    </>
  );
}
