'use client';
import Link from 'next/link';
import { useState } from 'react';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  brand: string;
  links?: NavLink[];
  brandColor?: 'primary' | 'secondary' | 'accent';
}

const brandColorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
};

export function Navbar({ brand, links = [], brandColor = 'primary' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/80 sticky top-0 z-40 backdrop-blur supports-backdrop-blur:bg-white/70">
      <div className="container flex items-center justify-between h-16">
        <Link
          href="/"
          className={`text-xl font-bold ${brandColorMap[brandColor]}`}
          aria-label={`${brand} - Home`}
        >
          {brand}
        </Link>
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="w-6 h-5 flex flex-col justify-between" aria-hidden="true">
            <span
              className={`block h-0.5 w-full bg-current transition-all ${menuOpen ? 'rotate-0 translate-y-0' : ''}`}
            />
            <span className="block h-0.5 w-full bg-current" />
            <span className="block h-0.5 w-full bg-current" />
          </div>
        </button>
      </div>
      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden transition-[max-height] duration-200 ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="container flex flex-col gap-1 py-2" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

Navbar.displayName = 'Navbar';
