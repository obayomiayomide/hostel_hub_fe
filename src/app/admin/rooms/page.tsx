'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Trash2, DoorOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { roomService } from '@/services/room.service';
import { hostelService } from '@/services/hostel.service';
import { getErrorMessage } from '@/lib/api';
import { PageLoader, EmptyState, Select, StatusBadge, Button, Modal, DataTable, type Column } from '@/components/ui';
import { RoomFormModal } from '@/components/forms/RoomFormModal';
import { formatCurrency } from '@/lib/utils';
import type { Room, Hostel } from '@/types';

function AdminRoomsContent() {
  const searchParams = useSearchParams();
  const initialHostelId = searchParams.get('hostelId');

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<string>(initialHostelId || '');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadHostels() {
    const data = await hostelService.getAll();
    setHostels(data);
  }

  async function loadRooms() {
    setLoading(true);
    try {
      const data = await roomService.getAll(selectedHostel ? { hostelId: Number(selectedHostel) } : undefined);
      setRooms(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHostels();
  }, []);

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHostel]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await roomService.remove(deleteTarget.id);
      toast.success('Room deleted');
      setDeleteTarget(null);
      loadRooms();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Room>[] = [
    { key: 'hostel', header: 'Hostel', render: (r) => r.hostel?.name || '—' },
    { key: 'room', header: 'Room No.', render: (r) => r.roomNumber },
    { key: 'floor', header: 'Floor', render: (r) => r.floor || '—' },
    { key: 'capacity', header: 'Capacity', render: (r) => `${r.occupiedBeds ?? 0}/${r.capacity}` },
    { key: 'price', header: 'Price/Session', render: (r) => formatCurrency(r.pricePerSession) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label="Delete room">
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Rooms &amp; Beds</h2>
          <p className="mt-1 text-sm text-ink-700/60">Manage rooms and their generated bed records.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" /> Add Room
        </Button>
      </div>

      <div className="max-w-xs">
        <Select
          placeholder="All hostels"
          value={selectedHostel}
          onChange={(e) => setSelectedHostel(e.target.value)}
          options={hostels.map((h) => ({ value: String(h.id), label: h.name }))}
        />
      </div>

      {loading ? (
        <PageLoader />
      ) : rooms.length === 0 ? (
        <EmptyState icon={<DoorOpen className="h-6 w-6" />} title="No rooms found" action={<Button size="sm" onClick={() => setShowForm(true)}>Add a room</Button>} />
      ) : (
        <DataTable columns={columns} data={rooms} rowKey={(r) => r.id} />
      )}

      {showForm && (
        <RoomFormModal
          hostels={hostels}
          defaultHostelId={selectedHostel ? Number(selectedHostel) : undefined}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadRooms();
          }}
        />
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Room" size="sm">
        <p className="text-sm text-ink-700/70">
          Delete Room <span className="font-medium text-ink-900">{deleteTarget?.roomNumber}</span> and all
          its bed records? Rooms with occupied beds cannot be deleted.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}

export default function AdminRoomsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminRoomsContent />
    </Suspense>
  );
}
