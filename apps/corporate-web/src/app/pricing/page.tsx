import type { Metadata } from 'next';
import { Section, CTASection, EvidenceDisclaimer } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Pricing | BudiMind Corporate',
  description:
    'Transparent pricing for confidential workforce wellbeing. Start with a free pilot, scale with growth.',
};

const tiers = [
  {
    name: 'Pilot',
    description: 'For small teams testing the platform.',
    price: 'Free',
    features: [
      'Up to 25 employees',
      'One assessment template',
      'Aggregate reports',
      'Email support',
    ],
    cta: 'Start Free Pilot',
    ctaHref: '/org/campaigns',
  },
  {
    name: 'Growth',
    description: 'For growing organisations ready to scale.',
    price: '$8',
    subprice: '/ employee / month',
    features: [
      'Unlimited employees',
      'All assessment templates',
      'Intervention programmes',
      'Priority support',
    ],
    cta: 'Get Started',
    ctaHref: '/contact',
    featured: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organisations.',
    price: 'Contact us',
    features: ['Custom instruments', 'SSO & integrations', 'Dedicated CSM', 'SLAs'],
    cta: 'Contact Sales',
    ctaHref: '/contact',
  },
];

export default function PricingPage() {
  return (
    <>
      <Section
        title="Pricing"
        subtitle="Transparent pricing. Start with a free pilot, scale as you grow."
        center
      >
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={`p-6 sm:p-8 rounded-xl border ${
                tier.featured
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              } flex flex-col`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-1">{tier.name}</h3>
              <p className="text-sm text-secondary mb-4 sm:mb-6">{tier.description}</p>
              <div className="mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-primary">{tier.price}</span>
                {tier.subprice && <span className="text-sm text-secondary">{tier.subprice}</span>}
              </div>
              <ul className="text-sm space-y-2 text-secondary mb-4 sm:mb-6 flex-1" role="list">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span aria-hidden="true">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaHref}
                className={`mt-auto px-6 py-2 rounded-lg font-medium text-center transition-colors ${
                  tier.featured
                    ? 'bg-accent text-white hover:opacity-90'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                {tier.cta}
              </a>
            </article>
          ))}
        </div>
      </Section>

      {/* Evidence-based disclaimer */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer
            text="BudiMind Corporate assessments are evidence-based screening tools and
          should not be used as a sole basis for employment decisions, clinical diagnosis, or medical
          advice. Pricing is subject to change."
          />
        </div>
      </Section>

      <CTASection
        title="Not sure where to start?"
        description="Talk to our team for a free, no-obligation consultation."
        actions={[{ label: 'Contact Us', href: '/contact' }]}
      />
    </>
  );
}
