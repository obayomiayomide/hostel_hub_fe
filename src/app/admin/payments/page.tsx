'use client';

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentService } from '@/services/payment.service';
import { getErrorMessage } from '@/lib/api';
import { PageLoader, EmptyState, Select, StatusBadge, DataTable, type Column } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Payment } from '@/types';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUCCESS', label: 'Successful' },
  { value: 'FAILED', label: 'Failed' },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    paymentService
      .getAll(statusFilter ? { status: statusFilter } : undefined)
      .then(({ data }) => setPayments(data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const columns: Column<Payment>[] = [
    { key: 'reference', header: 'Reference', render: (p) => <span className="font-mono text-xs">{p.reference}</span> },
    { key: 'student', header: 'Student', render: (p) => (
      <div>
        <p className="font-medium text-ink-900">{p.student?.fullName}</p>
        <p className="text-xs text-ink-700/50">{p.student?.matricNumber}</p>
      </div>
    ) },
    { key: 'hostel', header: 'Hostel', render: (p) => p.application?.hostel?.name || '—' },
    { key: 'amount', header: 'Amount', render: (p) => <span className="font-medium">{formatCurrency(p.amount)}</span> },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { key: 'date', header: 'Date', render: (p) => formatDate(p.createdAt, true) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Payments</h2>
        <p className="mt-1 text-sm text-ink-700/60">Every hostel fee transaction across the system.</p>
      </div>

      <div className="max-w-xs">
        <Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
      </div>

      {loading ? (
        <PageLoader />
      ) : payments.length === 0 ? (
        <EmptyState icon={<Wallet className="h-6 w-6" />} title="No payments found" />
      ) : (
        <DataTable columns={columns} data={payments} rowKey={(p) => p.id} />
      )}
    </div>
  );
}
