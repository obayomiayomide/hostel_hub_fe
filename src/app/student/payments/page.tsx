'use client';

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { paymentService } from '@/services/payment.service';
import { PageLoader, EmptyState, StatusBadge, DataTable, type Column } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Payment } from '@/types';

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService
      .getMine()
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const columns: Column<Payment>[] = [
    { key: 'reference', header: 'Reference', render: (p) => <span className="font-mono text-xs">{p.reference}</span> },
    { key: 'hostel', header: 'Hostel', render: (p) => p.application?.hostel?.name || '—' },
    { key: 'amount', header: 'Amount', render: (p) => <span className="font-medium">{formatCurrency(p.amount)}</span> },
    { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.status} /> },
    { key: 'date', header: 'Date', render: (p) => formatDate(p.createdAt, true) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Payment History</h2>
        <p className="mt-1 text-sm text-ink-700/60">A record of all your hostel fee transactions.</p>
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={<Wallet className="h-6 w-6" />} title="No payments yet" description="Your payment history will appear here once you make a payment." />
      ) : (
        <DataTable columns={columns} data={payments} rowKey={(p) => p.id} />
      )}
    </div>
  );
}
