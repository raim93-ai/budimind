import './tailwind-output.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Budimind - Psychology Clinic',
  description: 'Comprehensive psychological assessments and consultation services',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
          {children}
        </div>
      </body>
    </html>
  );
}