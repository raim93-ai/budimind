'use client';

import * as React from 'react';
import type { ReactNode } from 'react';

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <div className="min-h-screen bg-[url('/images/tatami-pattern.svg')] bg-[size:200px] text-[var(--foreground)] transition-colors duration-200">
      {children}
    </div>
  );
}