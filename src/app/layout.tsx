import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Serif_JP } from 'next/font/google';
import ThemeProvider from './theme-provider';

const inter = Inter({ subsets: ['latin'] });
const notoSerifJP = Noto_Serif_JP({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  display: 'swap' 
});

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
        <ThemeProvider>
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}