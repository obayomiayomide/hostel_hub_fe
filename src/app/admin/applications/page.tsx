'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, KeyRound, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationService } from '@/services/application.service';
import { allocationService } from '@/services/allocation.service';
import { getErrorMessage } from '@/lib/api';
import { PageLoader, EmptyState, Select, StatusBadge, Button, Modal, Textarea, DataTable, type Column } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Application } from '@/types';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAYMENT_PENDING', label: 'Awaiting Payment' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'ALLOCATED', label: 'Allocated' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { data } = await applicationService.getAll(statusFilter ? { status: statusFilter } : undefined);
      setApplications(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleApprove(app: Application) {
    setActionLoading(app.id);
    try {
      await applicationService.updateStatus(app.id, 'APPROVED');
      toast.success('Application approved');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject() {
    if (!rejectTarget) return;
    setActionLoading(rejectTarget.id);
    try {
      await applicationService.updateStatus(rejectTarget.id, 'REJECTED', remarks);
      toast.success('Application rejected');
      setRejectTarget(null);
      setRemarks('');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAllocate(app: Application) {
    setActionLoading(app.id);
    try {
      await allocationService.autoAllocate(app.id);
      toast.success('Bed space automatically allocated');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  const columns: Column<Application>[] = [
    { key: 'student', header: 'Student', render: (a) => (
      <div>
        <p className="font-medium text-ink-900">{a.student?.fullName}</p>
        <p className="text-xs text-ink-700/50">{a.student?.matricNumber}</p>
      </div>
    ) },
    { key: 'hostel', header: 'Hostel', render: (a) => a.hostel?.name },
    { key: 'session', header: 'Session', render: (a) => a.session?.name },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    { key: 'date', header: 'Applied', render: (a) => formatDate(a.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      render: (a) => (
        <div className="flex gap-1.5">
          {a.status === 'PENDING' && (
            <>
              <Button size="sm" variant="ghost" isLoading={actionLoading === a.id} onClick={() => handleApprove(a)}>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setRejectTarget(a)}>
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
          {a.status === 'APPROVED' && (
            <Button size="sm" variant="ghost" isLoading={actionLoading === a.id} onClick={() => handleAllocate(a)}>
              <KeyRound className="h-4 w-4 text-brand-600" /> Allocate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Applications</h2>
        <p className="mt-1 text-sm text-ink-700/60">Review, approve, and allocate student hostel applications.</p>
      </div>

      <div className="max-w-xs">
        <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
      </div>

      {loading ? (
        <PageLoader />
      ) : applications.length === 0 ? (
        <EmptyState icon={<FileText className="h-6 w-6" />} title="No applications found" />
      ) : (
        <DataTable columns={columns} data={applications} rowKey={(a) => a.id} />
      )}

      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Application" size="sm">
        <p className="text-sm text-ink-700/70 mb-3">
          Rejecting <span className="font-medium text-ink-900">{rejectTarget?.student?.fullName}</span>&apos;s
          application to {rejectTarget?.hostel?.name}.
        </p>
        <Textarea
          label="Reason (optional)"
          placeholder="E.g. Incomplete documentation..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setRejectTarget(null)}>Cancel</Button>
          <Button variant="danger" size="sm" isLoading={actionLoading === rejectTarget?.id} onClick={handleReject}>
            Reject Application
          </Button>
        </div>
      </Modal>
    </div>
  );
}
