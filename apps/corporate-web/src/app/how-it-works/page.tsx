import type { Metadata } from 'next';
import { EvidenceDisclaimer } from '@budimind/ui';

export const metadata: Metadata = {
  title: 'How It Works | BudiMind Corporate',
  description:
    'Three steps from setup to meaningful intervention — deploy confidential campaigns, collect validated wellbeing signals, and review privacy-safe trends.',
};

export default function HowItWorksPage() {
  return (
    <div className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900/40 flex-1">
      <div className="container">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-4">
          How It Works
        </h2>
        <p className="text-center text-secondary max-w-2xl mx-auto mb-8 sm:mb-12">
          Three steps from setup to meaningful intervention.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold"
              aria-hidden="true"
            >
              1
            </div>
            <h3 className="font-semibold text-primary mb-2">Launch</h3>
            <p className="text-sm text-secondary">
              Deploy a confidential campaign to your workforce in minutes.
            </p>
          </div>
          <div>
            <div
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold"
              aria-hidden="true"
            >
              2
            </div>
            <h3 className="font-semibold text-primary mb-2">Measure</h3>
            <p className="text-sm text-secondary">
              Collect validated wellbeing signals with individual anonymity.
            </p>
          </div>
          <div>
            <div
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold"
              aria-hidden="true"
            >
              3
            </div>
            <h3 className="font-semibold text-primary mb-2">Act</h3>
            <p className="text-sm text-secondary">
              Review privacy-safe trends and assign targeted interventions.
            </p>
          </div>
        </div>

        {/* Evidence-based disclaimer */}
        <div className="mt-12 max-w-3xl mx-auto">
          <EvidenceDisclaimer
            text="The wellbeing signals collected through our platform are based on
          validated psychological instruments (e.g., PHQ-9, GAD-7, K10). These are screening
          tools, not clinical diagnostic instruments. Aggregate results should inform programme
          decisions, not individual employment actions."
          />
        </div>
      </div>
    </div>
  );
}
