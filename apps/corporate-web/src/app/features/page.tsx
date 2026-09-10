import type { Metadata } from 'next';
import {
  Section,
  FeatureGrid,
  CTASection,
  EvidenceDisclaimer,
  PsychologyResources,
} from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Features & Solutions | BudiMind Corporate',
  description:
    'Confidential workforce assessments, privacy-released insights, and evidence-based interventions — built for HR, compliance, and wellbeing teams.',
  alternates: { canonical: 'https://corporate.budimind.com/features' },
};

const productFeatures = [
  {
    title: 'Confidential Campaigns',
    description:
      'Deploy validated psychological instruments to your workforce with end-to-end encryption and individual anonymity guarantees.',
  },
  {
    title: 'Privacy-Released Insights',
    description:
      'Aggregate dashboards show trends, hotspots, and cohorts without exposing individual responses — compliant by design.',
  },
  {
    title: 'Evidence-Based Interventions',
    description:
      'Assign targeted wellbeing programmes with built-in outcome tracking and ROI reporting.',
  },
  {
    title: 'Role-Based Access',
    description:
      'Granular permissions for HR, managers, professionals, and administrators — audit-logged throughout.',
  },
  {
    title: 'Compliance Ready',
    description:
      'Built to meet GDPR, ISO 27001, and local healthcare data requirements out of the gate.',
  },
  {
    title: 'Integrations',
    description: 'Connect to your HRIS, benefits platform, and single sign-on (SSO) seamlessly.',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Section
        title="Features"
        subtitle="Everything you need to measure, understand, and act on workforce wellbeing — without compromising privacy."
        center
      >
        <FeatureGrid features={productFeatures} />
      </Section>

      <Section title="By Team" subtitle="Built for the people who make wellbeing happen." center>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6 sm:gap-8 text-center">
          <article className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-2">HR & People</h3>
            <p className="text-sm text-secondary">
              Aggregate retention-risk signals and programme ROI without ever seeing individual
              responses.
            </p>
          </article>
          <article className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-2">Professionals</h3>
            <p className="text-sm text-secondary">
              Secure client assignment workflows and session-level reporting with full audit
              logging.
            </p>
          </article>
        </div>
      </Section>

      {/* Evidence-based disclaimer */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer
            text="BudiMind Corporate uses validated psychological instruments (e.g., PHQ-9,
          GAD-7, K10) for workforce wellbeing monitoring. These are screening tools, not clinical
          diagnostic instruments. Aggregate results should inform programme decisions, not
          individual employment actions. Always pair with professional clinical assessment for
          individual cases."
          />
        </div>
      </Section>

      {/* Psychology resources */}
      <div className="container pb-12">
        <PsychologyResources
          title="Referenced Psychological Instruments & Sources"
          intro="Our platform references these authoritative psychology and mental health sources:"
        />
      </div>

      <CTASection
        title="Ready to see it in action?"
        description="Start a confidential assessment campaign today."
        actions={[{ label: 'Start Assessment', href: '/org/campaigns' }]}
      />
    </>
  );
}
