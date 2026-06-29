'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  FileText,
  Wallet,
  Wrench,
  Users,
  CalendarRange,
  KeyRound,
  Home,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Browse Hostels', href: '/student/hostels', icon: Building2 },
  { label: 'My Applications', href: '/student/applications', icon: FileText },
  { label: 'Payments', href: '/student/payments', icon: Wallet },
  { label: 'Maintenance', href: '/student/maintenance', icon: Wrench },
  { label: 'Profile', href: '/student/profile', icon: Users },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Hostels', href: '/admin/hostels', icon: Building2 },
  { label: 'Rooms & Beds', href: '/admin/rooms', icon: DoorOpen },
  { label: 'Applications', href: '/admin/applications', icon: FileText },
  { label: 'Allocations', href: '/admin/allocations', icon: KeyRound },
  { label: 'Payments', href: '/admin/payments', icon: Wallet },
  { label: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Sessions', href: '/admin/sessions', icon: CalendarRange },
];

// Wardens have read/operational access (applications, allocations, payments,
// maintenance, dashboard) but hostel/room structure, user accounts, and
// academic sessions are reserved for full Admins.
const wardenRestrictedHrefs = new Set(['/admin/hostels', '/admin/rooms', '/admin/users', '/admin/sessions']);

function navForRole(role: Role): NavItem[] {
  if (role === 'STUDENT') return studentNav;
  if (role === 'WARDEN') return adminNav.filter((item) => !wardenRestrictedHrefs.has(item.href));
  return adminNav;
}

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navForRole(role);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-700/8 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-ink-700/8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Home className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-sm font-bold leading-tight text-ink-900">HostelHub</p>
          <p className="text-[11px] text-ink-700/50 leading-tight">Allocation System</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-700/70 hover:bg-ink-700/5 hover:text-ink-900'
                  )}
                >
                  <Icon className={cn('h-[18px] w-[18px]', active ? 'text-brand-600' : 'text-ink-700/40')} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-5 py-4 border-t border-ink-700/8">
        <p className="text-[11px] text-ink-700/40">
          {role === 'STUDENT' ? 'Student Portal' : 'Management Console'}
        </p>
      </div>
    </aside>
  );
}

export { studentNav, adminNav, navForRole };
