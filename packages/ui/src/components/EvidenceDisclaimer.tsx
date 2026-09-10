import type { HTMLAttributes } from 'react';
import Link from 'next/link';

/**
 * Evidence-based disclaimer banner.
 *
 * Displayed alongside assessments, screening tools, and mental health
 * content to make clear they are NOT diagnostic instruments and should
 * not replace professional evaluation or treatment.
 */
export interface EvidenceDisclaimerProps extends HTMLAttributes<HTMLElement> {
  /** Optional custom text */
  text?: string;
  /** If true, render as a compact inline note */
  compact?: boolean;
}

export function EvidenceDisclaimer({
  text,
  compact = false,
  className = '',
  ...props
}: EvidenceDisclaimerProps) {
  const defaultText =
    'These tools are for informational and screening purposes only. They are not a substitute for professional diagnosis, treatment, or advice. If you have concerns about your mental health, please consult a qualified healthcare or mental health professional.';

  if (compact) {
    return (
      <aside
        className={`text-xs text-secondary italic mt-3 p-2 rounded border-l-2 border-primary/30 ${className}`}
        {...props}
        aria-label="Disclaimer"
      >
        <span aria-label="Note: " className="font-medium">
          Note:
        </span>{' '}
        {text || defaultText}
      </aside>
    );
  }

  return (
    <aside
      className={`mt-6 p-4 sm:p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <svg
          className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m0-4h.01M12 11h0m0 0V9m0 2v2m0 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1 text-sm sm:text-base">
            Important: For Screening Purposes Only
          </h4>
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 text-pretty mb-2">
            {text || defaultText}
          </p>
          <Link
            href="/contact"
            className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 font-medium underline"
          >
            Find a licensed psychologist →
          </Link>
        </div>
      </div>
    </aside>
  );
}

EvidenceDisclaimer.displayName = 'EvidenceDisclaimer';
