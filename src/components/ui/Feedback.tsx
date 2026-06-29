import { HTMLAttributes } from 'react';
import { Loader2, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { statusLabel } from '@/lib/utils';

const statusToneMap: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAYMENT_PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-brand-100 text-brand-700',
  ALLOCATED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-200 text-ink-700',
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  VACATED: 'bg-slate-200 text-ink-700',
  OPEN: 'bg-amber-100 text-amber-700',
  IN_PROGRESS: 'bg-brand-100 text-brand-700',
  RESOLVED: 'bg-emerald-100 text-emerald-700',
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  FULL: 'bg-red-100 text-red-700',
  MAINTENANCE: 'bg-amber-100 text-amber-700',
  CLOSED: 'bg-slate-200 text-ink-700',
  VACANT: 'bg-emerald-100 text-emerald-700',
  OCCUPIED: 'bg-brand-100 text-brand-700',
  LOW: 'bg-slate-200 text-ink-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        statusToneMap[status] || 'bg-slate-200 text-ink-700',
        className
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-ink-700/8 px-2.5 py-1 text-xs font-medium text-ink-700',
        className
      )}
      {...props}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-brand-600', className)} />;
}

export function PageLoader() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-ink-700/15 bg-slate-25 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-700/8 text-ink-700/50">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <div>
        <p className="font-medium text-ink-900">{title}</p>
        {description && <p className="mt-1 text-sm text-ink-700/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}
