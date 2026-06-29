'use client';

import { useEffect, useState } from 'react';
import { Plus, CalendarRange, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { sessionService } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { Card, CardBody, PageLoader, EmptyState, Badge, Button, Modal, Input } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { formatDate } from '@/lib/utils';
import type { AcademicSession } from '@/types';

interface SessionForm {
  name: string;
  startDate?: string;
  endDate?: string;
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [activating, setActivating] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm<SessionForm>();

  async function load() {
    setLoading(true);
    try {
      const data = await sessionService.getAll();
      setSessions(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(values: SessionForm) {
    setCreating(true);
    try {
      await sessionService.create(values.name, values.startDate, values.endDate);
      toast.success('Academic session created');
      reset();
      setShowCreate(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleActivate(session: AcademicSession) {
    setActivating(session.id);
    try {
      await sessionService.activate(session.id);
      toast.success(`${session.name} is now the active session`);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActivating(null);
    }
  }

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Academic Sessions</h2>
          <p className="mt-1 text-sm text-ink-700/60">
            Only one session can be active at a time. Students apply against the active session.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> New Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <EmptyState icon={<CalendarRange className="h-6 w-6" />} title="No academic sessions yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardBody className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-ink-900">{s.name}</p>
                  {s.isActive && <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>}
                </div>
                <div className="flex items-center gap-3">
                  {s.startDate && <p className="text-xs text-ink-700/50">{formatDate(s.startDate)}</p>}
                  {!s.isActive && (
                    <Button size="sm" variant="outline" isLoading={activating === s.id} onClick={() => handleActivate(s)}>
                      <CheckCircle2 className="h-4 w-4" /> Activate
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Academic Session" size="sm">
        <form onSubmit={handleSubmit(onCreate)} className="flex flex-col gap-4">
          <Input label="Session Name" placeholder="2026/2027" required {...register('name')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" {...register('startDate')} />
            <Input label="End Date" type="date" {...register('endDate')} />
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" isLoading={creating}>Create Session</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
