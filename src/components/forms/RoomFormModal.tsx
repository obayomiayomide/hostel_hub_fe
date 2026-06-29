'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { roomService, type RoomPayload } from '@/services/room.service';
import { getErrorMessage } from '@/lib/api';
import { Modal, Input, Select, Button } from '@/components/ui';
import type { Hostel } from '@/types';

interface RoomFormModalProps {
  hostels: Hostel[];
  defaultHostelId?: number;
  onClose: () => void;
  onSaved: () => void;
}

export function RoomFormModal({ hostels, defaultHostelId, onClose, onSaved }: RoomFormModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<RoomPayload>({
    defaultValues: {
      hostelId: defaultHostelId,
      roomNumber: '',
      floor: '',
      capacity: 4,
      pricePerSession: 45000,
    },
  });

  async function onSubmit(values: RoomPayload) {
    setSubmitting(true);
    try {
      await roomService.create({
        ...values,
        hostelId: Number(values.hostelId),
        capacity: Number(values.capacity),
        pricePerSession: Number(values.pricePerSession),
      });
      toast.success('Room created with bed records generated');
      onSaved();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Add New Room">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select
          label="Hostel"
          required
          options={hostels.map((h) => ({ value: String(h.id), label: h.name }))}
          {...register('hostelId', { valueAsNumber: true })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Room Number" required placeholder="101" {...register('roomNumber')} />
          <Input label="Floor" placeholder="Ground Floor" {...register('floor')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Capacity (Beds)" type="number" min={1} max={20} required {...register('capacity', { valueAsNumber: true })} />
          <Input label="Price per Session (₦)" type="number" min={0} required {...register('pricePerSession', { valueAsNumber: true })} />
        </div>
        <p className="text-xs text-ink-700/50">
          Bed records will be generated automatically based on the capacity you set.
        </p>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={submitting}>Create Room</Button>
        </div>
      </form>
    </Modal>
  );
}
