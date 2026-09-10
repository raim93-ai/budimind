import type { Metadata } from 'next';
import { EvidenceDisclaimer } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'Terms of Service | BudiMind Clinic',
  description: 'Terms of service for using BudiMind Clinic platform and mental health services.',
  alternates: { canonical: 'https://clinic.budimind.com/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900/40">
      <div className="container">
        <h2 className="text-3xl font-bold text-primary mb-6">Terms of Service</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Acceptance of Terms</h3>
          <p className="text-secondary mb-6">
            These Terms of Service govern your use of the BudiMind Clinic platform and associated
            services.
          </p>
          <div className="space-y-4 text-left">
            <div>
              <h4 className="font-medium mb-2">1. Overview</h4>
              <p className="text-secondary mb-3">
                These terms apply to all visitors, users, and others who access or use the BudiMind
                Clinic website or any other media form, channel, mobile application, or online
                service of BudiMind Clinic.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. User Accounts</h4>
              <p className="text-secondary mb-3">
                When you create an account with BudiMind Clinic, you agree to provide accurate,
                complete, and up-to-date information. You are responsible for maintaining the
                security of your account password and any activity under your account.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. User Conduct</h4>
              <p className="text-secondary mb-3">
                You agree not to use the BudiMind Clinic platform for any illegal or unauthorized
                purpose. You must not, in the use of the Service, violate any local, state, national
                or international law.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">4. No Medical Advice / Disclaimer</h4>
              <p className="text-secondary mb-3">
                The content, tools, and services provided on this platform are for informational and
                screening purposes only and do not constitute medical, psychological, or
                professional advice. Always seek the advice of your physician, psychologist, or
                other qualified health provider with any questions you may have regarding a medical
                or mental health condition.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">5. Termination</h4>
              <p className="text-secondary mb-3">
                BudiMind Clinic may terminate or suspend your account immediately, without prior
                notice or liability, for any reason whatsoever, including without limitation if you
                breach the Terms.
              </p>
            </div>
          </div>

          {/* Evidence-based disclaimer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <EvidenceDisclaimer />
          </div>

          <p className="mt-8 text-secondary text-sm">Last updated: January 2024</p>
        </div>
      </div>
    </div>
  );
}
