'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Wallet, Wrench, KeyRound, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/services';
import { Card, CardBody, PageLoader, StatusBadge, Button } from '@/components/ui';
import type { StudentStats } from '@/types';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStudentStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const allocation = stats?.currentAllocation;

  const statCards = [
    { label: 'Applications Submitted', value: stats?.applications ?? 0, icon: FileText, color: 'bg-brand-50 text-brand-600' },
    { label: 'Successful Payments', value: stats?.successfulPayments ?? 0, icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Maintenance Requests', value: stats?.maintenanceRequests ?? 0, icon: Wrench, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">
          Welcome, {user?.fullName?.split(' ')[0]} 👋
        </h2>
        <p className="mt-1 text-sm text-ink-700/60">
          Here's a quick overview of your hostel application and accommodation status.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardBody className="flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink-900">{s.value}</p>
                <p className="text-xs text-ink-700/60">{s.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink-900 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-brand-600" /> Current Room Allocation
            </h3>
            {allocation && <StatusBadge status={allocation.status} />}
          </div>

          {allocation ? (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-ink-700/50">Hostel</p>
                <p className="text-sm font-medium text-ink-900">{allocation.bed?.room?.hostel?.name}</p>
              </div>
              <div>
                <p className="text-xs text-ink-700/50">Room</p>
                <p className="text-sm font-medium text-ink-900">{allocation.bed?.room?.roomNumber}</p>
              </div>
              <div>
                <p className="text-xs text-ink-700/50">Bed</p>
                <p className="text-sm font-medium text-ink-900">{allocation.bed?.bedNumber}</p>
              </div>
              <div>
                <p className="text-xs text-ink-700/50">Session</p>
                <p className="text-sm font-medium text-ink-900">{allocation.session?.name}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-700/60">
                You don&apos;t have an active room allocation yet. Browse available hostels and submit an
                application to get started.
              </p>
              <Link href="/student/hostels">
                <Button size="sm">
                  <Building2 className="h-4 w-4" /> Browse Hostels <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
