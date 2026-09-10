import type { Metadata } from 'next';
import { EvidenceDisclaimer, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Privacy | BudiMind Clinic',
  description:
    'Privacy policy for BudiMind Clinic - how we handle your personal and health information.',
  alternates: { canonical: 'https://clinic.budimind.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900/40">
      <div className="container">
        <h2 className="text-3xl font-bold text-primary mb-6">Privacy Policy</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h3>
          <p className="text-secondary mb-6">
            At BudiMind Clinic, we are committed to protecting your privacy and ensuring your
            personal and health information is handled with the utmost care.
          </p>
          <div className="space-y-4 text-left">
            <div>
              <h4 className="font-medium mb-2">Information We Collect</h4>
              <ul className="list-disc pl-5">
                <li>Personal information (name, email, contact details)</li>
                <li>Health information for appointment booking</li>
                <li>Payment information for services</li>
                <li>Session notes and clinical records</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">How We Use Your Information</h4>
              <ul className="list-disc pl-5">
                <li>To provide and improve our mental health services</li>
                <li>To schedule and manage appointments</li>
                <li>For billing and payment processing</li>
                <li>To comply with legal and regulatory requirements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Your Rights</h4>
              <ul className="list-disc pl-5">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of certain data usages</li>
              </ul>
            </div>
          </div>

          {/* Privacy & compliance references */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium mb-3 text-sm text-primary">
              Relevant Standards & References
            </h4>
            <p className="text-xs text-secondary mb-3 text-pretty">
              Our privacy practices align with applicable health data protection frameworks and
              evidence-based privacy guidelines from authoritative sources:
            </p>
            <ul className="space-y-2" role="list">
              <li>
                <a
                  href="https://www.hhs.gov/hipaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  HIPAA (US Health Insurance Portability and Accountability Act)
                </a>
              </li>
              <li>
                <a
                  href="https://gdpr-info.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  GDPR (General Data Protection Regulation)
                </a>
              </li>
              <li>
                <a
                  href="https://www.moh.gov.my"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Malaysian Ministry of Health - Health Information Guidelines
                </a>
              </li>
              <li>
                <a
                  href="https://www.apa.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  American Psychological Association - Ethics Code
                </a>
              </li>
            </ul>
          </div>

          <p className="mt-8 text-secondary text-sm">Last updated: January 2024</p>
        </div>
      </div>

      {/* Evidence-based disclaimer */}
      <div className="container py-8">
        <EvidenceDisclaimer />
      </div>

      {/* Psychology resources */}
      <div className="container pb-12">
        <PsychologyResources
          title="Mental Health References"
          intro="For additional evidence-based information on mental health topics:"
        />
      </div>
    </div>
  );
}
