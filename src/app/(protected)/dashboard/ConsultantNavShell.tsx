'use client';

import AppShell, { type NavItem } from '@/components/AppShell';
import {
  LayoutDashboard, Users, ClipboardList, Building2, TrendingUp, UserPlus,
} from 'lucide-react';

// Client-side nav config so icon components never cross the RSC boundary.
// The server dashboard renders its data as children through this wrapper.
const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/patients', label: 'Patients', icon: Users },
  { href: '/dashboard/patients/new', label: 'Register patient', icon: UserPlus },
  { href: '/assessment', label: 'Assessment library', icon: ClipboardList },
  { href: '/dashboard/trends', label: 'Trends', icon: TrendingUp },
  { href: '/dashboard/company', label: 'Corporate view', icon: Building2 },
];

export default function ConsultantNavShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell brandSub="Practitioner" nav={NAV}>
      {children}
    </AppShell>
  );
}
