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
  title: 'Corporate Workforce Assessment & Analytics | BudiMind',
  description:
    'Confidential assessments, privacy-released insights, and evidence-based interventions for organisational wellbeing.',
  openGraph: {
    title: 'Corporate Workforce Assessment & Analytics | BudiMind',
    description:
      'Confidential assessments, privacy-released insights, and evidence-based interventions for organisational wellbeing.',
  },
};

const features = [
  {
    title: 'Confidential Assessments',
    description:
      'Evidence-based psychological instruments delivered through a secure, privacy-first platform trusted by HR and legal teams.',
  },
  {
    title: 'Privacy-Released Insights',
    description:
      'Aggregate analytics that preserve individual anonymity — actionable trends without compromising confidentiality.',
  },
  {
    title: 'Evidence-Based Interventions',
    description:
      'Targeted wellbeing programmes with measurable ROI on engagement, retention, and productivity.',
  },
  {
    title: 'Role-Based Access',
    description:
      'Granular permissions for HR, managers, professionals, and administrators — audit-logged throughout.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container text-center max-w-3xl px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-primary text-balance">
            Confident. Confidential. Actionable.
          </h1>
          <p className="text-base sm:text-lg text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty">
            Confidential workforce assessments, privacy-released insights, and evidence-based
            interventions for organisational wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/features" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
            <Link href="/solutions" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Solutions
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Crisis Support Banner */}
      <div className="container py-6">
        <CrisisSupport compact />
      </div>

      {/* Trust signals */}
      <section className="py-8 sm:py-12 border-t border-b border-gray-200 dark:border-gray-700">
        <div className="container text-center">
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4 sm:mb-6">
            Trusted by organisations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-60">
            <span className="text-sm font-medium">Enterprise</span>
            <span className="text-sm">&middot;</span>
            <span className="text-sm font-medium">SME</span>
            <span className="text-sm">&middot;</span>
            <span className="text-sm font-medium">Government</span>
            <span className="text-sm">&middot;</span>
            <span className="text-sm font-medium">Healthcare</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <Section
        title="What We Offer"
        subtitle="A comprehensive platform for workforce mental health — from assessment to intervention."
        center
      >
        <FeatureGrid features={features} />
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
          title="Evidence-Based References"
          intro="Our platform and content reference the following authoritative psychology and mental health
          sources:"
        />
      </div>

      {/* CTA */}
      <CTASection
        title="Ready to transform your workplace wellbeing?"
        description="Start with a free pilot. Scale with confidence."
        actions={[
          { label: 'Get Started', href: '/contact' },
          { label: 'Learn More', href: '/about', variant: 'secondary' },
        ]}
      />
    </>
  );
}
