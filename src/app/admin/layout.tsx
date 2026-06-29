'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageLoader } from '@/components/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth(['ADMIN', 'WARDEN']);

  if (isLoading || !user) return <PageLoader />;

  return <DashboardShell role={user.role}>{children}</DashboardShell>;
}
