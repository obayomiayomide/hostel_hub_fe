'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { hostelService } from '@/services/hostel.service';
import { getErrorMessage } from '@/lib/api';
import { Card, CardBody, PageLoader, EmptyState, Badge, Button, Modal } from '@/components/ui';
import { HostelFormModal } from '@/components/forms/HostelFormModal';
import type { Hostel } from '@/types';

export default function AdminHostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [formTarget, setFormTarget] = useState<Hostel | null | 'new'>(null);
  const [deleteTarget, setDeleteTarget] = useState<Hostel | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await hostelService.getAll();
      setHostels(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await hostelService.remove(deleteTarget.id);
      toast.success('Hostel deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Hostels</h2>
          <p className="mt-1 text-sm text-ink-700/60">Manage hostel buildings and their wardens.</p>
        </div>
        <Button size="sm" onClick={() => setFormTarget('new')}>
          <Plus className="h-4 w-4" /> Add Hostel
        </Button>
      </div>

      {hostels.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title="No hostels yet"
          action={<Button size="sm" onClick={() => setFormTarget('new')}>Add your first hostel</Button>}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel) => (
            <Card key={hostel.id}>
              <CardBody className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display font-semibold text-ink-900">{hostel.name}</p>
                    <p className="text-xs text-ink-700/50">{hostel.location}</p>
                  </div>
                  <Badge>{hostel.type}</Badge>
                </div>
                <div className="flex gap-4 text-xs text-ink-700/60">
                  <span>{hostel.roomCount ?? 0} rooms</span>
                  <span>{hostel.totalBeds ?? 0} beds</span>
                  <span className="font-medium text-emerald-600">{hostel.vacantBeds ?? 0} vacant</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setFormTarget(hostel)}
                      className="rounded-lg p-2 text-ink-700/60 hover:bg-ink-700/5"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(hostel)}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Link
                    href={`/admin/rooms?hostelId=${hostel.id}`}
                    className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
                  >
                    Manage Rooms <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {formTarget && (
        <HostelFormModal
          hostel={formTarget === 'new' ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSaved={() => {
            setFormTarget(null);
            load();
          }}
        />
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Hostel" size="sm">
        <p className="text-sm text-ink-700/70">
          Delete <span className="font-medium text-ink-900">{deleteTarget?.name}</span>? This will also
          remove all its rooms and beds.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
