import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-25 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold text-ink-900">HostelHub</span>
        </Link>
        <div className="rounded-xl2 border border-ink-700/8 bg-white p-7 shadow-card">{children}</div>
      </div>
    </div>
  );
}
