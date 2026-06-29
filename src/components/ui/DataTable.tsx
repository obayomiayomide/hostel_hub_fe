import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, rowKey, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl2 border border-ink-700/8 bg-white shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-700/8 bg-slate-25">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-700/60', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-700/50">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={rowKey(row)} className="border-b border-ink-700/6 last:border-0 hover:bg-slate-25/60">
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3 text-ink-800', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
