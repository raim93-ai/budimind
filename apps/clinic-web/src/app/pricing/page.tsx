import type { Metadata } from 'next';
import { Section, CTASection, EvidenceDisclaimer } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Pricing | BudiMind Clinic',
  description:
    'Transparent pricing for mental health services. Pay per session or use your employer benefits.',
  alternates: { canonical: 'https://clinic.budimind.com/pricing' },
};

const packages = [
  {
    name: 'Single Session',
    description: 'One confidential session with a licensed psychologist.',
    price: 'RM 350',
    features: ['50-minute session', 'Secure video or in-person', 'Aftercare notes'],
    cta: 'Book Now',
    ctaHref: '/book',
  },
  {
    name: '5-Session Package',
    description: 'A short, focused programme for specific concerns.',
    price: 'RM 1,550',
    features: ['Five 50-minute sessions', 'Progress review', 'Flexible scheduling'],
    cta: 'Book Now',
    ctaHref: '/book',
    featured: true,
  },
  {
    name: 'Employer Covered',
    description: "Full coverage through your organisation's benefits plan.",
    price: 'Covered',
    features: ['No out-of-pocket', 'All clinicians', 'Priority scheduling'],
    cta: 'Check Coverage',
    ctaHref: '/contact',
  },
];

export default function PricingPage() {
  return (
    <>
      <Section
        title="Pricing"
        subtitle="Transparent, upfront pricing. Pay per session or use your employer benefits."
        center
      >
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`p-8 rounded-xl border flex flex-col ${
                pkg.featured
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <h3 className="text-xl font-bold text-primary mb-1">{pkg.name}</h3>
              <p className="text-sm text-secondary mb-6">{pkg.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">{pkg.price}</span>
              </div>
              <ul className="text-sm space-y-2 text-secondary mb-6 flex-1">
                {pkg.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <a
                href={pkg.ctaHref}
                className={`mt-auto px-6 py-2 rounded-lg font-medium text-center ${
                  pkg.featured
                    ? 'bg-accent text-white hover:opacity-90'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Evidence-based disclaimer on pricing page */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer
            text="Pricing is subject to change. Insurance and employer benefit coverage
          varies by plan. Please contact us to verify your coverage before booking. These
          services are for informational purposes and are not a substitute for emergency
          medical or psychiatric care."
          />
        </div>
      </Section>

      <CTASection
        title="Have more questions?"
        description="We're here to help — contact us for a no-obligation chat."
        actions={[{ label: 'Contact Us', href: '/contact' }]}
      />
    </>
  );
}
