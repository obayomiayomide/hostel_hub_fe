'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { maintenanceService } from '@/services/maintenance.service';
import { getErrorMessage } from '@/lib/api';
import { Card, CardBody, Select, Textarea, Button } from '@/components/ui';

const schema = z.object({
  category: z.enum(['PLUMBING', 'ELECTRICAL', 'STRUCTURAL', 'FURNITURE', 'CLEANING', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  description: z.string().min(5, 'Please provide more detail (at least 5 characters)'),
});

type FormData = z.infer<typeof schema>;

const categoryOptions = [
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'STRUCTURAL', label: 'Structural' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'OTHER', label: 'Other' },
];

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export default function NewMaintenanceRequestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { priority: 'MEDIUM' } });

  async function onSubmit(values: FormData) {
    setSubmitting(true);
    try {
      await maintenanceService.create(values);
      toast.success('Maintenance request submitted');
      router.push('/student/maintenance');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">New Maintenance Request</h2>
        <p className="mt-1 text-sm text-ink-700/60">
          Describe the issue you're experiencing in your room. It will automatically be linked to your
          allocated room.
        </p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Select
              label="Category"
              required
              options={categoryOptions}
              error={errors.category?.message}
              {...register('category')}
            />
            <Select
              label="Priority"
              required
              options={priorityOptions}
              error={errors.priority?.message}
              {...register('priority')}
            />
            <Textarea
              label="Description"
              required
              placeholder="E.g. The bathroom tap has been leaking continuously since yesterday..."
              error={errors.description?.message}
              {...register('description')}
            />
            <Button type="submit" isLoading={submitting} className="w-fit">
              Submit Request
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
