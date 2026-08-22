'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Brain, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AppShellProps {
  brandSub: string;          // e.g. "Practitioner", "Acme Corp", "Personal"
  nav: NavItem[];
  children: React.ReactNode;
}

const COLLAPSE_KEY = 'budimind-sidebar-collapsed';

export default function AppShell({ brandSub, nav, children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY);
    if (saved === '1') setCollapsed(true);
    fetch('/api/auth/session')
      .then(r => (r.ok ? r.json() : null))
      .then(d => setName(d?.fullName ?? ''))
      .catch(() => {});
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggle = () => {
    setCollapsed(c => {
      localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1');
      return !c;
    });
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const sidebarWidth = collapsed ? 'w-[68px]' : 'w-60';

  const navList = (onNavigate?: () => void) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {nav.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline ${
              active
                ? 'bg-[var(--primary-soft)] text-primary'
                : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const footerButtons = (onNavigate?: () => void) => (
    <div className={`px-3 pb-4 space-y-1 border-t border-[var(--border)] pt-3 ${collapsed ? 'flex flex-col items-center' : ''}`}>
      {!collapsed && name && (
        <div className="px-3 pb-2 text-xs text-[var(--muted-foreground)] truncate">Signed in as {name}</div>
      )}
      <button
        onClick={logout}
        title="Sign out"
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-destructive hover:bg-red-50 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
      >
        <LogOut className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && 'Sign out'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col sticky top-0 h-screen border-r border-[var(--border)] bg-white transition-all duration-200 ${sidebarWidth}`}
      >
        <div className={`h-16 flex items-center gap-2.5 px-4 border-b border-[var(--border)] shrink-0 ${collapsed ? 'justify-center px-0' : ''}`}>
          <Link href="/" className="flex items-center gap-2.5 no-underline min-w-0">
            <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Brain className="h-4 w-4 text-white" />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block font-bold leading-tight text-[var(--foreground)]">Budimind</span>
                <span className="block text-[11px] text-[var(--muted-foreground)] leading-tight truncate">{brandSub}</span>
              </span>
            )}
          </Link>
        </div>

        {navList()}
        {footerButtons()}

        <button
          onClick={toggle}
          className="mx-3 mb-4 flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] py-2 text-xs text-[var(--muted-foreground)] hover:text-primary hover:border-primary/40 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && 'Collapse'}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-white h-full shadow-xl">
            <div className="h-16 flex items-center gap-2.5 px-4 border-b border-[var(--border)]">
              <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </span>
              <div className="min-w-0">
                <div className="font-bold leading-tight">Budimind</div>
                <div className="text-[11px] text-[var(--muted-foreground)] truncate">{brandSub}</div>
              </div>
            </div>
            {navList(() => setMobileOpen(false))}
            {footerButtons(() => setMobileOpen(false))}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 backdrop-blur-md bg-[var(--background)]/85 border-b border-[var(--border)]">
          <div className="h-14 px-4 flex items-center justify-between">
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu"
              className="p-2 -ml-2 rounded-lg hover:bg-[var(--muted)] transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-sm font-bold">{brandSub}</span>
            <span className="h-8 w-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-primary text-xs font-bold">
              {(name || '?').slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
