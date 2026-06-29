import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function formatDate(date: string | Date, withTime = false): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending Review',
  PAYMENT_PENDING: 'Awaiting Payment',
  APPROVED: 'Approved',
  ALLOCATED: 'Room Allocated',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  SUCCESS: 'Successful',
  FAILED: 'Failed',
  ACTIVE: 'Active',
  VACATED: 'Vacated',
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  AVAILABLE: 'Available',
  FULL: 'Full',
  MAINTENANCE: 'Under Maintenance',
  CLOSED: 'Closed',
  VACANT: 'Vacant',
  OCCUPIED: 'Occupied',
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}
