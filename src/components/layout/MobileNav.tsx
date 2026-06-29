'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';
import { navForRole } from './Sidebar';

export function MobileNav({ open, onClose, role }: { open: boolean; onClose: () => void; role: Role }) {
  const pathname = usePathname();
  const items = navForRole(role);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink-950/50 lg:hidden" onClick={onClose} aria-hidden />
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-elevated lg:hidden">
        <div className="flex items-center justify-between px-5 py-5 border-b border-ink-700/8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Home className="h-5 w-5" />
            </div>
            <p className="font-display text-sm font-bold text-ink-900">HostelHub</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-700/60 hover:bg-ink-700/5" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 py-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                      active ? 'bg-brand-50 text-brand-700' : 'text-ink-700/70 hover:bg-ink-700/5'
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
