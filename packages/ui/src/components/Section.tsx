import type { ReactNode } from 'react';
import type { HTMLAttributes } from 'react';

export interface Feature {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  center?: boolean;
}

export function Section({
  title,
  subtitle,
  center = true,
  children,
  className = '',
  ...props
}: SectionProps) {
  return (
    <section
      className={`py-12 md:py-20 lg:py-24 ${center ? 'text-center' : ''} ${className}`}
      {...props}
    >
      <div className="container">
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-base sm:text-lg text-secondary max-w-3xl mx-auto mb-8 sm:mb-12 text-pretty">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          {feature.icon && (
            <div
              className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              {feature.icon}
            </div>
          )}
          <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">{feature.title}</h3>
          <p className="text-secondary text-sm leading-relaxed">{feature.description}</p>
        </article>
      ))}
    </div>
  );
}

export function CTASection({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions: Array<{
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
  }>;
}) {
  return (
    <section className="py-12 md:py-20 bg-primary text-white text-center">
      <div className="container max-w-3xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-balance">{title}</h2>
        {description && (
          <p className="text-base sm:text-lg mb-8 opacity-90 text-pretty">{description}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {actions.map((action) => (
            <a
              key={action.href}
              href={action.href}
              className={`px-6 sm:px-8 py-3 rounded-lg font-medium transition-all text-base ${
                action.variant === 'secondary'
                  ? 'border-2 border-white text-white hover:bg-white hover:text-primary'
                  : 'bg-accent text-white hover:opacity-90'
              }`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

Section.displayName = 'Section';
FeatureGrid.displayName = 'FeatureGrid';
CTASection.displayName = 'CTASection';
