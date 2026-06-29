'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, CreditCard, XCircle, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationService } from '@/services/application.service';
import { getErrorMessage } from '@/lib/api';
import { Card, CardBody, PageLoader, EmptyState, StatusBadge, Button, Modal, Input } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Application } from '@/types';
import { PaymentModal } from '@/components/forms/PaymentModal';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [payTarget, setPayTarget] = useState<Application | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Application | null>(null);
  const [cancelling, setCancelling] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await applicationService.getMine();
      setApplications(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await applicationService.cancel(cancelTarget.id);
      toast.success('Application cancelled');
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">My Applications</h2>
          <p className="mt-1 text-sm text-ink-700/60">Track the status of your hostel applications.</p>
        </div>
        <Link href="/student/hostels">
          <Button size="sm">
            <Building2 className="h-4 w-4" /> Apply for a Hostel
          </Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No applications yet"
          description="Browse our hostels and submit your first application."
          action={
            <Link href="/student/hostels">
              <Button size="sm">Browse Hostels</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-ink-900">{app.hostel?.name}</p>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="mt-1 text-xs text-ink-700/50">
                    Session {app.session?.name} · Applied {formatDate(app.createdAt)}
                  </p>
                  {app.allocation && (
                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      Allocated: Room {app.allocation.bed?.room?.roomNumber}, Bed {app.allocation.bed?.bedNumber}
                    </p>
                  )}
                  {app.remarks && <p className="mt-1 text-xs text-ink-700/60">Remark: {app.remarks}</p>}
                </div>
                <div className="flex gap-2">
                  {(app.status === 'PENDING' || app.status === 'PAYMENT_PENDING') && (
                    <Button size="sm" onClick={() => setPayTarget(app)}>
                      <CreditCard className="h-4 w-4" /> Pay Now
                    </Button>
                  )}
                  {app.status !== 'ALLOCATED' && app.status !== 'CANCELLED' && app.status !== 'REJECTED' && (
                    <Button size="sm" variant="outline" onClick={() => setCancelTarget(app)}>
                      <XCircle className="h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {payTarget && (
        <PaymentModal
          application={payTarget}
          onClose={() => setPayTarget(null)}
          onSuccess={() => {
            setPayTarget(null);
            load();
          }}
        />
      )}

      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Application" size="sm">
        <p className="text-sm text-ink-700/70">
          Are you sure you want to cancel your application to{' '}
          <span className="font-medium text-ink-900">{cancelTarget?.hostel?.name}</span>? This action cannot
          be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setCancelTarget(null)}>
            Keep Application
          </Button>
          <Button variant="danger" size="sm" isLoading={cancelling} onClick={handleCancel}>
            Yes, Cancel It
          </Button>
        </div>
      </Modal>
    </div>
  );
}
