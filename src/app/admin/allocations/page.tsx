'use client';

import { useEffect, useState } from 'react';
import { LogOut, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { allocationService } from '@/services/allocation.service';
import { getErrorMessage } from '@/lib/api';
import { PageLoader, EmptyState, StatusBadge, Button, Modal, DataTable, type Column } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { Allocation } from '@/types';

export default function AdminAllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [vacateTarget, setVacateTarget] = useState<Allocation | null>(null);
  const [vacating, setVacating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await allocationService.getAll();
      setAllocations(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleVacate() {
    if (!vacateTarget) return;
    setVacating(true);
    try {
      await allocationService.vacate(vacateTarget.id);
      toast.success('Bed space vacated');
      setVacateTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setVacating(false);
    }
  }

  const columns: Column<Allocation>[] = [
    { key: 'student', header: 'Student', render: (a) => (
      <div>
        <p className="font-medium text-ink-900">{a.student?.fullName}</p>
        <p className="text-xs text-ink-700/50">{a.student?.matricNumber}</p>
      </div>
    ) },
    { key: 'hostel', header: 'Hostel', render: (a) => a.bed?.room?.hostel?.name },
    { key: 'room', header: 'Room / Bed', render: (a) => `${a.bed?.room?.roomNumber} / ${a.bed?.bedNumber}` },
    { key: 'session', header: 'Session', render: (a) => a.session?.name },
    { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
    { key: 'date', header: 'Allocated', render: (a) => formatDate(a.allocatedAt) },
    {
      key: 'actions',
      header: '',
      render: (a) =>
        a.status === 'ACTIVE' ? (
          <Button size="sm" variant="ghost" onClick={() => setVacateTarget(a)}>
            <LogOut className="h-4 w-4 text-red-500" /> Vacate
          </Button>
        ) : null,
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Allocations</h2>
        <p className="mt-1 text-sm text-ink-700/60">All active and historical room/bed allocations.</p>
      </div>

      {allocations.length === 0 ? (
        <EmptyState icon={<KeyRound className="h-6 w-6" />} title="No allocations yet" />
      ) : (
        <DataTable columns={columns} data={allocations} rowKey={(a) => a.id} />
      )}

      <Modal open={!!vacateTarget} onClose={() => setVacateTarget(null)} title="Vacate Allocation" size="sm">
        <p className="text-sm text-ink-700/70">
          Vacate <span className="font-medium text-ink-900">{vacateTarget?.student?.fullName}</span> from
          Room {vacateTarget?.bed?.room?.roomNumber}, Bed {vacateTarget?.bed?.bedNumber}? The bed will
          become available for new allocation.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setVacateTarget(null)}>Cancel</Button>
          <Button variant="danger" size="sm" isLoading={vacating} onClick={handleVacate}>Vacate</Button>
        </div>
      </Modal>
    </div>
  );
}
