import type { HTMLAttributes } from 'react';

/**
 * Reputable, authoritative psychology / mental health reference resources.
 * These are used for contextual links throughout the site so users can
 * verify information and learn more from trusted sources.
 *
 * All links open in a new tab with noreferrer for safety.
 */
export const psychologyResources = [
  {
    name: 'American Psychological Association (APA)',
    url: 'https://www.apa.org',
    description: 'The leading scientific and professional organization for psychology in the US.',
  },
  {
    name: 'APA - Psychology Topics',
    url: 'https://www.apa.org/topics',
    description: 'Evidence-based articles on mental health conditions, treatments, and research.',
  },
  {
    name: 'National Institute of Mental Health (NIMH)',
    url: 'https://www.nimh.nih.gov/health',
    description:
      'Authoritative mental health information from the US National Institutes of Health.',
  },
  {
    name: 'Mayo Clinic - Mental Health',
    url: 'https://www.mayoclinic.org/healthy-lifestyle',
    description: 'Clinical guidance on mental health conditions, symptoms, and treatment.',
  },
  {
    name: 'Verywell Mind',
    url: 'https://www.verywellmind.com',
    description: 'Medically reviewed mental health articles written by clinical experts.',
  },
  {
    name: 'Anxiety & Depression Association of America (ADAA)',
    url: 'https://adaa.org',
    description:
      'International non-profit dedicated to anxiety, depression, OCD, PTSD, and related disorders.',
  },
  {
    name: 'Mental Health America (MHA)',
    url: 'https://www.mhanational.org',
    description: 'Premier community-based nonprofit for mental health in the US.',
  },
  {
    name: 'World Health Organization - Mental Health',
    url: 'https://www.who.int/health-topics/mental-health',
    description:
      'Global perspective on mental health, mental disorders, and evidence-based strategies.',
  },
] as const;

export interface PsychologyResourcesProps extends HTMLAttributes<HTMLElement> {
  /** Optional title for the section */
  title?: string;
  /** Optional introductory text */
  intro?: string;
}

export function PsychologyResources({
  title = 'Further Reading & References',
  intro = 'For additional evidence-based information on mental health topics, we recommend the following authoritative sources:',
  className = '',
  ...props
}: PsychologyResourcesProps) {
  return (
    <section
      className={`mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {title && <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>}
      {intro && <p className="text-sm text-secondary mb-4 text-pretty">{intro}</p>}
      <ul className="space-y-3" role="list">
        {psychologyResources.map((resource) => (
          <li key={resource.url}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
              aria-label={`External link: ${resource.name}`}
            >
              {resource.name}
            </a>
            <p className="text-xs text-secondary mt-1 text-pretty">{resource.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

PsychologyResources.displayName = 'PsychologyResources';
