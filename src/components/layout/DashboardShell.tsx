import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { Role } from '@/types';

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: Role;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-25">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
