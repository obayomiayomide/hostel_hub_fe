'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Building2, MapPin, BedDouble, DoorOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { hostelService } from '@/services/hostel.service';
import { applicationService } from '@/services/application.service';
import { sessionService } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { Card, CardBody, PageLoader, EmptyState, Badge, Button, StatusBadge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Hostel, AcademicSession } from '@/types';

export default function HostelDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [activeSession, setActiveSession] = useState<AcademicSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const id = Number(params.id);
    Promise.all([hostelService.getById(id), sessionService.getActive()])
      .then(([h, s]) => {
        setHostel(h);
        setActiveSession(s);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleApply() {
    if (!hostel) return;
    if (!activeSession) {
      toast.error('No active academic session found. Please contact the administrator.');
      return;
    }
    setApplying(true);
    try {
      await applicationService.create({ hostelId: hostel.id, sessionId: activeSession.id });
      toast.success('Application submitted successfully!');
      router.push('/student/applications');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setApplying(false);
    }
  }

  if (loading) return <PageLoader />;
  if (!hostel) return <EmptyState title="Hostel not found" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold text-ink-900">{hostel.name}</h2>
            <Badge>{hostel.type}</Badge>
          </div>
          {hostel.location && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-700/60">
              <MapPin className="h-4 w-4" /> {hostel.location}
            </p>
          )}
        </div>
        <Button onClick={handleApply} isLoading={applying} disabled={!activeSession}>
          Apply for Accommodation
        </Button>
      </div>

      <Card>
        <CardBody>
          <p className="text-sm leading-relaxed text-ink-700/75">{hostel.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 rounded-lg bg-slate-25 px-3 py-2">
              <BedDouble className="h-4 w-4 text-brand-600" />
              <span className="font-medium text-ink-900">{hostel.vacantBeds ?? 0}</span> vacant beds
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-25 px-3 py-2">
              <DoorOpen className="h-4 w-4 text-brand-600" />
              <span className="font-medium text-ink-900">{hostel.rooms?.length ?? 0}</span> total rooms
            </div>
          </div>
        </CardBody>
      </Card>

      <div>
        <h3 className="font-display text-base font-semibold text-ink-900 mb-3">Rooms</h3>
        {!hostel.rooms || hostel.rooms.length === 0 ? (
          <EmptyState title="No rooms have been added to this hostel yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hostel.rooms.map((room) => {
              const vacant = room.beds.filter((b) => b.status === 'VACANT').length;
              return (
                <Card key={room.id}>
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-ink-900">Room {room.roomNumber}</p>
                      <StatusBadge status={room.status} />
                    </div>
                    <p className="mt-1 text-xs text-ink-700/50">{room.floor}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-ink-700/70">{vacant} / {room.capacity} beds vacant</span>
                      <span className="font-semibold text-ink-900">{formatCurrency(room.pricePerSession)}</span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
