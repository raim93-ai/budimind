import Link from 'next/link';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  brand: string;
  tagline?: string;
  columns?: FooterColumn[];
  copyright?: string;
}

export function Footer({
  brand,
  tagline = '',
  columns = [],
  copyright = `© ${new Date().getFullYear()} ${brand}. All rights reserved.`,
}: FooterProps) {
  const today = new Date().getFullYear();
  return (
    <footer
      className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-12 mt-auto"
      role="contentinfo"
    >
      <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-bold text-primary">{brand}</h3>
          {tagline && <p className="mt-2 text-sm text-secondary">{tagline}</p>}
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-primary mb-3">{col.title}</h4>
            <ul className="space-y-2" role="list">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-secondary">
        <p>{copyright.replace(String(today), String(today))}</p>
      </div>
    </footer>
  );
}

Footer.displayName = 'Footer';
