import type { HTMLAttributes } from 'react';

/**
 * Crisis support resource entry.
 * Some entries have phone numbers (hotlines), others are web-only.
 */
interface CrisisResource {
  name: string;
  url: string;
  phone?: string;
  phoneDisplay?: string;
  description?: string;
}

/**
 * Crisis support resources.
 *
 * These are emergency / crisis helplines that should be prominently
 * displayed on mental health websites so users in distress can get help.
 */
export const crisisResources: {
  malaysia: CrisisResource[];
  global: CrisisResource[];
} = {
  malaysia: [
    {
      name: 'Befrienders Malaysia',
      phone: '15999',
      phoneDisplay: '15999',
      url: 'https://www.befrienders.org.my',
      description: '24/7 emotional support helpline for anyone in distress.',
    },
    {
      name: 'Talian Kasih',
      phone: '016-2387888',
      phoneDisplay: '016-2387888',
      url: 'https://www.kpwj.gov.my',
      description: 'Child and adolescent mental health helpline.',
    },
    {
      name: 'Ministry of Health Mental Health Division',
      url: 'https://www.moh.gov.my',
      description: 'National mental health policies, resources, and professional referrals.',
    },
  ],
  global: [
    {
      name: 'International Association for Suicide Prevention (IASP)',
      url: 'https://www.iasp.info/resources/Crisis_Centres/',
      description: 'Global directory of crisis centres and suicide prevention hotlines.',
    },
    {
      name: 'Befrienders Worldwide',
      url: 'https://www.befrienders.org',
      description: 'International network of emotional support organisations.',
    },
  ],
};

export interface CrisisSupportProps extends HTMLAttributes<HTMLElement> {
  /** If true, show only the most critical emergency contact */
  compact?: boolean;
}

export function CrisisSupport({ compact = false, className = '', ...props }: CrisisSupportProps) {
  return (
    <section
      className={`rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 sm:p-6 ${className}`}
      {...props}
      aria-label="Crisis support resources"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2 text-sm sm:text-base">
            Crisis Support
          </h3>
          {!compact && (
            <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 mb-3 text-pretty">
              If you are in crisis or in immediate danger of harming yourself or others, please
              reach out right away.
            </p>
          )}
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-red-900 dark:text-red-200 uppercase tracking-wide">
                Malaysia (24/7)
              </p>
              <ul className="mt-1 space-y-1" role="list">
                {crisisResources.malaysia.map((r) => (
                  <li key={r.name} className="text-xs sm:text-sm">
                    <span className="font-medium text-red-900 dark:text-red-200">{r.name}:</span>{' '}
                    {r.phone ? (
                      <a
                        href={`tel:${r.phone}`}
                        className="text-red-700 dark:text-red-300 hover:underline font-medium"
                      >
                        {r.phoneDisplay}
                      </a>
                    ) : (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-700 dark:text-red-300 hover:underline font-medium"
                      >
                        Visit website
                      </a>
                    )}{' '}
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 dark:text-red-300 hover:underline"
                    >
                      {r.url.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-900 dark:text-red-200 uppercase tracking-wide">
                Global Resources
              </p>
              <ul className="mt-1 space-y-1" role="list">
                {crisisResources.global.map((r) => (
                  <li key={r.name} className="text-xs sm:text-sm">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 dark:text-red-300 hover:underline font-medium"
                    >
                      {r.name}
                    </a>{' '}
                    <span className="text-red-800/70 dark:text-red-300/70">&mdash;</span>{' '}
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 dark:text-red-300 hover:underline text-xs"
                    >
                      {r.url.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

CrisisSupport.displayName = 'CrisisSupport';
