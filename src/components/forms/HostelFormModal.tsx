'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { hostelService, type HostelPayload } from '@/services/hostel.service';
import { getErrorMessage } from '@/lib/api';
import { Modal, Input, Select, Textarea, Button } from '@/components/ui';
import type { Hostel } from '@/types';

interface HostelFormModalProps {
  hostel?: Hostel | null;
  onClose: () => void;
  onSaved: () => void;
}

const typeOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'MIXED', label: 'Mixed' },
];

export function HostelFormModal({ hostel, onClose, onSaved }: HostelFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!hostel;

  const { register, handleSubmit } = useForm<HostelPayload>({
    defaultValues: {
      name: hostel?.name || '',
      type: hostel?.type || 'MIXED',
      description: hostel?.description || '',
      location: hostel?.location || '',
    },
  });

  async function onSubmit(values: HostelPayload) {
    setSubmitting(true);
    try {
      if (isEdit && hostel) {
        await hostelService.update(hostel.id, values);
        toast.success('Hostel updated successfully');
      } else {
        await hostelService.create(values);
        toast.success('Hostel created successfully');
      }
      onSaved();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open onClose={onClose} title={isEdit ? 'Edit Hostel' : 'Add New Hostel'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Hostel Name" required placeholder="Unity Hall" {...register('name')} />
        <Select label="Hostel Type" required options={typeOptions} {...register('type')} />
        <Input label="Location" placeholder="North Campus" {...register('location')} />
        <Textarea label="Description" placeholder="Brief description of the hostel..." {...register('description')} />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={submitting}>
            {isEdit ? 'Save Changes' : 'Create Hostel'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
