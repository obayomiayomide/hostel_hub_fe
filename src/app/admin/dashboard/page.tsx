'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Building2,
  BedDouble,
  Wallet,
  FileText,
  Wrench,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { dashboardService } from '@/services';
import { Card, CardBody, CardHeader, CardTitle, PageLoader } from '@/components/ui';
import { formatCurrency, statusLabel } from '@/lib/utils';
import type { AdminStats, HostelOccupancy } from '@/types';

const PIE_COLORS = ['#2F6FE0', '#DB9320', '#16a34a', '#dc2626', '#64748b', '#9333ea'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [occupancy, setOccupancy] = useState<HostelOccupancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardService.getAdminStats(), dashboardService.getOccupancy()])
      .then(([s, o]) => {
        setStats(s);
        setOccupancy(o);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <PageLoader />;

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-brand-50 text-brand-600' },
    { label: 'Hostels', value: stats.totalHostels, icon: Building2, color: 'bg-amber-50 text-amber-600' },
    { label: 'Bed Occupancy', value: `${stats.occupancyRate}%`, icon: BedDouble, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: Wallet, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Applications', value: stats.pendingApplications, icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Open Maintenance', value: stats.openMaintenance, icon: Wrench, color: 'bg-red-50 text-red-600' },
  ];

  const applicationPieData = stats.applicationsByStatus.map((a) => ({ name: statusLabel(a.status), value: a.count }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-ink-700/60">A real-time overview of hostel operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardBody className="flex items-center gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-ink-900">{s.value}</p>
                <p className="text-xs text-ink-700/60">{s.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Occupancy by Hostel</CardTitle>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancy} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E9F0" />
                <XAxis dataKey="hostelName" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="occupiedBeds" name="Occupied" fill="#2F6FE0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vacantBeds" name="Vacant" fill="#FBC857" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {applicationPieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
