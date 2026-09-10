import type { Metadata } from 'next';
import { Section, CrisisSupport, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Contact Us | BudiMind Corporate',
  description:
    'Get in touch with BudiMind for sales, partnerships, or general enquiries. We are here to help.',
  alternates: { canonical: 'https://corporate.budimind.com/contact' },
};

export default function ContactPage() {
  return (
    <>
      <Section
        title="Contact Us"
        subtitle="Have a question? Reach out and we'll get back to you within one business day."
        center
      >
        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 text-left">
            <div>
              <h3 className="font-semibold text-primary mb-2">Sales</h3>
              <p className="text-sm text-secondary mb-1">For demos and pricing:</p>
              <p className="text-sm text-secondary">
                <a href="mailto:sales@budimind.com" className="hover:underline">
                  sales@budimind.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Support</h3>
              <p className="text-sm text-secondary mb-1">For technical help:</p>
              <p className="text-sm text-secondary">
                <a href="mailto:support@budimind.com" className="hover:underline">
                  support@budimind.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Press</h3>
              <p className="text-sm text-secondary mb-1">Media enquiries:</p>
              <p className="text-sm text-secondary">
                <a href="mailto:press@budimind.com" className="hover:underline">
                  press@budimind.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Address</h3>
              <p className="text-sm text-secondary">
                Level 3, Menara Multipurpose, No. 18, Jalan Sultan, 50000 Kuala Lumpur, Malaysia
              </p>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 p-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-secondary">
              Prefer to schedule a conversation? Email us at{' '}
              <a href="mailto:sales@budimind.com" className="text-primary hover:underline">
                sales@budimind.com
              </a>{' '}
              and we will arrange a call at your convenience.
            </p>
          </div>
        </div>
      </Section>

      {/* Crisis support on contact page */}
      <div className="container py-8">
        <CrisisSupport />
      </div>

      {/* Psychology resources */}
      <div className="container pb-12">
        <PsychologyResources
          title="Mental Health Resources"
          intro="For additional evidence-based information on mental health topics, we recommend the
          following authoritative sources:"
        />
      </div>
    </>
  );
}
