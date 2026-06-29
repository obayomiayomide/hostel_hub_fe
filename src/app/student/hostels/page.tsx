'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, MapPin, BedDouble, ArrowRight } from 'lucide-react';
import { hostelService } from '@/services/hostel.service';
import { Card, CardBody, PageLoader, EmptyState, Badge } from '@/components/ui';
import type { Hostel } from '@/types';

export default function BrowseHostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hostelService
      .getAll({ isActive: true })
      .then(setHostels)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Browse Hostels</h2>
        <p className="mt-1 text-sm text-ink-700/60">
          View available hostels and their current bed-space vacancies before applying.
        </p>
      </div>

      {hostels.length === 0 ? (
        <EmptyState icon={<Building2 className="h-6 w-6" />} title="No hostels available" description="Check back later for hostel listings." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel) => (
            <Card key={hostel.id} className="flex flex-col overflow-hidden">
              <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800 text-white">
                <Building2 className="h-10 w-10 opacity-80" />
              </div>
              <CardBody className="flex flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-ink-900">{hostel.name}</h3>
                  <Badge>{hostel.type}</Badge>
                </div>
                {hostel.location && (
                  <p className="flex items-center gap-1.5 text-xs text-ink-700/60">
                    <MapPin className="h-3.5 w-3.5" /> {hostel.location}
                  </p>
                )}
                <p className="line-clamp-2 text-sm text-ink-700/70">{hostel.description}</p>

                <div className="mt-1 flex items-center gap-2 rounded-lg bg-slate-25 px-3 py-2 text-xs text-ink-700/70">
                  <BedDouble className="h-4 w-4 text-brand-600" />
                  <span className="font-medium text-ink-900">{hostel.vacantBeds ?? 0}</span> bed spaces vacant
                  &nbsp;·&nbsp; {hostel.roomCount ?? 0} rooms
                </div>

                <Link
                  href={`/student/hostels/${hostel.id}`}
                  className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  View Details &amp; Apply <ArrowRight className="h-4 w-4" />
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
