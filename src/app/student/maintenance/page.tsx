'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Wrench, Plus } from 'lucide-react';
import { maintenanceService } from '@/services/maintenance.service';
import { Card, CardBody, PageLoader, EmptyState, StatusBadge, Button, Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { MaintenanceRequest } from '@/types';

export default function StudentMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    maintenanceService
      .getMine()
      .then(setRequests)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Maintenance Requests</h2>
          <p className="mt-1 text-sm text-ink-700/60">Report and track issues with your room.</p>
        </div>
        <Link href="/student/maintenance/new">
          <Button size="sm">
            <Plus className="h-4 w-4" /> New Request
          </Button>
        </Link>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<Wrench className="h-6 w-6" />}
          title="No maintenance requests"
          description="If you have any issues with your room, submit a request and we'll take care of it."
          action={
            <Link href="/student/maintenance/new">
              <Button size="sm">Submit a Request</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink-900">{req.category}</p>
                    <Badge>{req.priority}</Badge>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="mt-1 text-sm text-ink-700/65">{req.description}</p>
                  <p className="mt-1 text-xs text-ink-700/40">
                    {req.room?.hostel?.name ? `${req.room.hostel.name} · Room ${req.room.roomNumber} · ` : ''}
                    Reported {formatDate(req.createdAt)}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
