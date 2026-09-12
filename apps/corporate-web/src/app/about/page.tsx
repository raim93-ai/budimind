import type { Metadata } from 'next';
import { Section, CTASection, EvidenceDisclaimer, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'About Us | BudiMind Corporate',
  description:
    'BudiMind builds privacy-first workplace mental health platforms that help organisations measure, understand, and act on workforce wellbeing.',
};

export default function AboutPage() {
  return (
    <>
      <Section title="About BudiMind" subtitle="Confidential. Evidence-based. Actionable." center>
        <div className="max-w-3xl mx-auto space-y-6 text-secondary text-sm sm:text-base text-left sm:text-center">
          <p>
            BudiMind was founded on a simple conviction: mental health at work should be measurable
            without being invasive. We bring together clinical psychologists, data scientists, and
            engineers to build the platforms organisations need to support their people — while
            keeping every individual's privacy intact.
          </p>
          <p>
            Our assessments are grounded in validated psychological instruments and local regulatory
            frameworks. Insights are released only in aggregate, so teams can act on trends without
            ever seeing individual-level data.
          </p>
          <p>
            Our work is informed by evidence-based practice from authoritative sources including the{' '}
            <a
              href="https://www.apa.org"
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
            </a>
            . Read more in our{' '}
            <a href="/security" className="text-primary hover:underline">
              security &amp; compliance
            </a>{' '}
            documentation.
          </p>
        </div>
      </Section>

      <Section title="Our Values" center className="bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div>
            <h3 className="font-semibold text-primary mb-2">Confidentiality</h3>
            <p className="text-sm text-secondary">
              Individual anonymity is never compromised. Aggregate-first design.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-2">Evidence</h3>
            <p className="text-sm text-secondary">
              Built on validated instruments and continuous outcome measurement.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-2">Actionability</h3>
            <p className="text-sm text-secondary">
              Data that translates directly into targeted interventions.
            </p>
          </div>
        </div>
      </Section>

      {/* Evidence-based disclaimer */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer
            text="BudiMind Corporate assessments are evidence-based screening tools and
          should not be used as a sole basis for employment decisions, clinical diagnosis, or medical
          advice. For individual clinical concerns, always refer to qualified mental health
          professionals. Aggregate insights are de-identified and designed to preserve anonymity."
          />
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

      <CTASection
        title="Join us in making workplace wellbeing measurable."
        actions={[
          { label: 'Contact Us', href: '/contact' },
          { label: 'Start Assessment', href: '/org/campaigns', variant: 'secondary' },
        ]}
      />
    </>
  );
}
