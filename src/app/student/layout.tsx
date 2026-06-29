'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageLoader } from '@/components/ui';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth(['STUDENT']);

  if (isLoading || !user) return <PageLoader />;

  return <DashboardShell role="STUDENT">{children}</DashboardShell>;
}
