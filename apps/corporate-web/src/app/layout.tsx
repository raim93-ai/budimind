import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar, Footer, CrisisSupport } from '@budimind/ui';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1A365D' },
    { media: '(prefers-color-scheme: dark)', color: '#1A202C' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'BudiMind Corporate — Workforce Assessment & Analytics',
    template: '%s | BudiMind Corporate',
  },
  description:
    'Confidential workforce assessments, privacy-released insights, and evidence-based interventions for organisational wellbeing.',
  keywords: [
    'workplace mental health',
    'employee wellbeing',
    'corporate psychology',
    'assessment',
    'analytics',
    'interventions',
    'EAP',
    'employee assistance',
    'psychological safety',
    'workforce wellness',
  ],
  authors: [{ name: 'BudiMind' }],
  openGraph: {
    type: 'website',
    locale: 'en-US',
    url: 'https://corporate.budimind.com',
    siteName: 'BudiMind Corporate',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://corporate.budimind.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/security' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help center', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
  {
    title: 'Crisis Support',
    links: [
      { label: 'Befrienders Malaysia (15999)', href: 'https://www.befrienders.org.my' },
      { label: 'Crisis Help', href: '/contact' },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured data for the corporate organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'BudiMind Corporate',
              url: 'https://corporate.budimind.com',
              logo: 'https://corporate.budimind.com/logo.png',
              description:
                'Confidential workforce assessments, privacy-released insights, and evidence-based interventions for organisational wellbeing.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kuala Lumpur',
                addressCountry: 'MY',
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+60-11-1111-2222',
                  email: 'hello@budimind.com',
                  contactType: 'sales',
                  areaServed: 'MY',
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+60-11-1111-2222',
                  email: 'support@budimind.com',
                  contactType: 'technical support',
                  areaServed: 'MY',
                },
              ],
              sameAs: [
                'https://www.befrienders.org.my',
                'https://www.moh.gov.my',
                'https://www.apa.org',
              ],
            }),
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar brand="BudiMind Corporate" links={navLinks} brandColor="primary" />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer
          brand="BudiMind Corporate"
          tagline="Confidential Workforce Intelligence"
          columns={footerColumns}
        />
        {/* Crisis support banner at the bottom for immediate access */}
        <div className="container py-6">
          <CrisisSupport />
        </div>
      </body>
    </html>
  );
}
