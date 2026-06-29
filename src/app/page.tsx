import Link from 'next/link';
import { Building2, ShieldCheck, Wallet, Wrench, ArrowRight, KeyRound } from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'Browse Hostels Online',
    description: 'Students view real-time room and bed availability across every hostel before applying — no more guessing or queueing.',
  },
  {
    icon: KeyRound,
    title: 'Automated Room Allocation',
    description: 'A fair, gender-matched, first-come-first-served algorithm assigns bed spaces the moment payment is confirmed.',
  },
  {
    icon: Wallet,
    title: 'Secure Online Payments',
    description: 'Pay hostel fees from anywhere and get instant confirmation, with a full digital record of every transaction.',
  },
  {
    icon: Wrench,
    title: 'Maintenance Requests',
    description: 'Report plumbing, electrical, or structural issues in seconds and track resolution status in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Administration',
    description: 'Wardens and admins get live occupancy analytics, application pipelines, and audit-ready records.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-25">
      <header className="border-b border-ink-700/8 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-ink-900">HostelHub</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-ink-700 hover:text-ink-900">
              Log In
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700 shadow-card"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Web-Based Hostel Management
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
            Hostel allocation, reimagined for the web.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-700/70">
            HostelHub replaces manual, paper-based hostel allocation with a transparent, automated
            system — from application and payment, to fair room allocation and maintenance support.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700 shadow-card"
            >
              Apply for Hostel Accommodation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-xl border border-ink-700/15 px-6 text-sm font-semibold text-ink-800 hover:bg-ink-700/5"
            >
              Staff / Admin Login
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl2 border border-ink-700/8 bg-white p-6 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700/65">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-700/8 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-ink-700/50">
          © {new Date().getFullYear()} HostelHub — Student Hostel Allocation Management System.
        </div>
      </footer>
    </div>
  );
}
