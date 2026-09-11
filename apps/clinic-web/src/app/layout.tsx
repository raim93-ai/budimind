import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar, Footer } from '@budimind/ui';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [{ color: '#f7f5ef' }],
};

export const metadata: Metadata = {
  title: {
    default: 'BudiMind — Psychology services in Kuala Lumpur',
    template: '%s | BudiMind Clinic',
  },
  description:
    'BudiMind is preparing psychology services for adults online and in Desa Melawati, Kuala Lumpur.',
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
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
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
  { label: 'Resources', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const footerColumns = [
  {
    title: 'Services',
    links: [
      { label: 'Find a Psychologist', href: '/psychologists' },
      { label: 'Our Services', href: '/services' },
      { label: 'Booking status', href: '/book' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Client area', href: '/appointments' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Our Psychologists', href: '/psychologists' },
      { label: 'Resources', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact status', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
  {
    title: 'Crisis Support',
    links: [
      { label: 'Emergency services (999)', href: 'tel:999' },
      { label: 'Talian HEAL (15555)', href: 'tel:15555' },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
          tagline="Psychology services · Pre-launch"
          columns={footerColumns}
        />
      </body>
    </html>
  );
}
