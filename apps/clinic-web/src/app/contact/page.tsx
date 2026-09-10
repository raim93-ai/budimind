import type { Metadata } from 'next';
import { Section, CrisisSupport, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Contact Us | BudiMind Clinic',
  description:
    'Reach out to BudiMind Clinic for bookings, general enquiries, or clinic questions. We respond within one business day.',
  alternates: { canonical: 'https://clinic.budimind.com/contact' },
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
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-semibold text-primary mb-2">Bookings</h3>
              <p className="text-sm text-secondary mb-1">For appointments and availability:</p>
              <p className="text-sm text-secondary">care@budimind.com</p>
              <p className="text-sm text-secondary">+60 11-1111 2222</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">General Enquiries</h3>
              <p className="text-sm text-secondary mb-1">
                Partnerships, media, or general questions:
              </p>
              <p className="text-sm text-secondary">hello@budimind.com</p>
              <p className="text-sm text-secondary">+60 11-1111 2222</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Clinics</h3>
              <p className="text-sm text-secondary">Shah Alam &amp; Subang Jaya, Malaysia.</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Hours</h3>
              <p className="text-sm text-secondary">Mon-Fri: 8am-8pm, Sat: 9am-5pm, Sun: closed.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Crisis support on the contact page */}
      <div className="container py-8">
        <CrisisSupport />
      </div>

      {/* Psychology resources reference */}
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
