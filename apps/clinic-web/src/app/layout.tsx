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
    default: 'BudiMind Clinic — Mental Health Support',
    template: '%s | BudiMind Clinic',
  },
  description:
    'Verified clinical psychologists, flexible booking, and confidential care. Available for individuals and employer-supported employees.',
  keywords: [
    'mental health',
    'psychologist',
    'counselling',
    'therapy',
    'booking',
    'confidential care',
    'anxiety',
    'depression',
    'psychological assessment',
    'clinical psychology',
  ],
  authors: [{ name: 'BudiMind' }],
  openGraph: {
    type: 'website',
    locale: 'en-US',
    url: 'https://clinic.budimind.com',
    siteName: 'BudiMind Clinic',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://clinic.budimind.com' },
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
  { label: 'Psychologists', href: '/psychologists' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Book', href: '/book' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const footerColumns = [
  {
    title: 'Services',
    links: [
      { label: 'Find a Psychologist', href: '/psychologists' },
      { label: 'Our Services', href: '/services' },
      { label: 'Book Appointment', href: '/book' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'My Appointments', href: '/appointments' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Our Psychologists', href: '/psychologists' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
  {
    title: 'Crisis Support',
    links: [
      { label: 'Befrienders Malaysia (15999)', href: 'https://www.befrienders.org.my' },
      { label: 'Crisis Resources', href: '/contact' },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Structured data for the organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MedicalOrganization',
              name: 'BudiMind Clinic',
              url: 'https://clinic.budimind.com',
              logo: 'https://clinic.budimind.com/logo.png',
              description:
                'Verified clinical psychologists, flexible booking, and confidential care.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kuala Lumpur',
                addressCountry: 'MY',
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+60-11-1111-2222',
                  email: 'care@budimind.com',
                  contactType: 'customer service',
                  areaServed: 'MY',
                },
              ],
              medicalSpecialty: ['Clinical Psychology', 'Counselling Psychology', 'Mental Health'],
              sameAs: ['https://www.befrienders.org.my', 'https://www.moh.gov.my'],
            }),
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar brand="BudiMind Clinic" links={navLinks} brandColor="primary" />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer
          brand="BudiMind Clinic"
          tagline="Confidential Mental Health Care"
          columns={footerColumns}
        />
        {/* Crisis support banner at the very bottom for immediate access */}
        <div className="container py-6">
          <CrisisSupport />
        </div>
      </body>
    </html>
  );
}
