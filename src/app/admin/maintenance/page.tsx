'use client';

import { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { maintenanceService } from '@/services/maintenance.service';
import { getErrorMessage } from '@/lib/api';
import { PageLoader, EmptyState, Select, Badge, DataTable, type Column } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { MaintenanceRequest } from '@/types';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function AdminMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await maintenanceService.getAll(statusFilter ? { status: statusFilter } : undefined);
      setRequests(data);
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

  async function handleStatusChange(id: number, status: string) {
    try {
      await maintenanceService.update(id, { status });
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  const updateOptions = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const columns: Column<MaintenanceRequest>[] = [
    { key: 'student', header: 'Student', render: (r) => r.student?.fullName },
    { key: 'location', header: 'Location', render: (r) => (r.room ? `${r.room.hostel?.name} · ${r.room.roomNumber}` : '—') },
    { key: 'category', header: 'Category', render: (r) => r.category },
    { key: 'priority', header: 'Priority', render: (r) => <Badge>{r.priority}</Badge> },
    { key: 'description', header: 'Description', render: (r) => <span className="line-clamp-2 max-w-xs">{r.description}</span> },
    { key: 'date', header: 'Reported', render: (r) => formatDate(r.createdAt) },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Select
          value={r.status}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          options={updateOptions}
          className="!h-9 !py-1.5 text-xs"
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Maintenance Requests</h2>
        <p className="mt-1 text-sm text-ink-700/60">Track and resolve student-reported issues.</p>
      </div>

      <div className="max-w-xs">
        <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
      </div>

      {loading ? (
        <PageLoader />
      ) : requests.length === 0 ? (
        <EmptyState icon={<Wrench className="h-6 w-6" />} title="No maintenance requests found" />
      ) : (
        <DataTable columns={columns} data={requests} rowKey={(r) => r.id} />
      )}
    </div>
  );
}
