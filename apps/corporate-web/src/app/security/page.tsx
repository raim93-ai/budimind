import type { Metadata } from 'next';
import { Section, EvidenceDisclaimer, PsychologyResources } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Security & Compliance | BudiMind Corporate',
  description: 'Security and compliance features for the BudiMind corporate wellbeing platform.',
};

export default function SecurityPage() {
  return (
    <>
      <div className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900/40 flex-1">
        <div className="container">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">
            Security &amp; Compliance
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Data Protection</h3>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>End-to-end encryption for all client data</li>
              <li>GDPR-compliant data handling and storage</li>
              <li>ISO 27001 certified security infrastructure</li>
              <li>Regular security audits and penetration testing</li>
            </ul>
            <h3 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
              Privacy Controls
            </h3>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Individual anonymity in aggregate analytics</li>
              <li>Granular consent management</li>
              <li>Data retention policies aligned with healthcare regulations</li>
              <li>Secure data export and deletion capabilities</li>
            </ul>
            <h3 className="text-xl sm:text-2xl font-semibold mt-6 sm:mt-8 mb-3 sm:mb-4">
              Audit &amp; Compliance
            </h3>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Full audit logs of all user actions</li>
              <li>Role-based access control with audit logging</li>
              <li>Compliance reporting for HR and legal teams</li>
              <li>Regular compliance certifications and updates</li>
            </ul>

            {/* Compliance reference links */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-3 text-sm text-primary">
                Compliance Frameworks &amp; References
              </h4>
              <p className="text-xs text-secondary mb-3 text-pretty">
                Our security and compliance practices align with these authoritative standards:
              </p>
              <ul className="space-y-2" role="list">
                <li>
                  <a
                    href="https://gdpr-info.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    GDPR (General Data Protection Regulation)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.hhs.gov/hipaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    HIPAA (US Health Insurance Portability and Accountability Act)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.iso.org/isoiec-27001-information-security.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    ISO 27001 (Information Security Management)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.moh.gov.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Malaysian Ministry of Health - Health Information Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.apa.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    American Psychological Association - Ethics Code
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-secondary text-sm">
                BudiMind Corporate is built with healthcare-grade security and compliance from the
                ground up, ensuring your organisation's data remains protected at all times.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence-based disclaimer */}
      <Section center>
        <div className="max-w-3xl mx-auto">
          <EvidenceDisclaimer
            text="BudiMind Corporate assessments are evidence-based screening tools and
          should not be used as a sole basis for employment decisions, clinical diagnosis, or medical
          advice. Aggregate insights are de-identified and designed to preserve anonymity."
          />
        </div>
      </Section>

      {/* Psychology resources */}
      <div className="container pb-12">
        <PsychologyResources
          title="Evidence-Based References"
          intro="Our platform and content reference these authoritative psychology and mental health sources:"
        />
      </div>
    </>
  );
}
