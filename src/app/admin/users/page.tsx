'use client';

import { useEffect, useState } from 'react';
import { Users, Plus, Ban, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { PageLoader, EmptyState, Select, Badge, Button, Modal, Input, DataTable, type Column } from '@/components/ui';
import { useForm } from 'react-hook-form';
import type { User } from '@/types';

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'STUDENT', label: 'Students' },
  { value: 'WARDEN', label: 'Wardens' },
  { value: 'ADMIN', label: 'Admins' },
];

interface NewUserForm {
  fullName: string;
  email: string;
  password: string;
  gender: 'MALE' | 'FEMALE';
  role: 'WARDEN' | 'ADMIN';
  phone?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset } = useForm<NewUserForm>({
    defaultValues: { role: 'WARDEN', gender: 'MALE' },
  });

  async function load() {
    setLoading(true);
    try {
      const { data } = await userService.getAll(roleFilter ? { role: roleFilter } : undefined);
      setUsers(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  async function handleToggleStatus(user: User) {
    try {
      await userService.toggleStatus(user.id);
      toast.success(`${user.fullName} ${user.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function onCreate(values: NewUserForm) {
    setCreating(true);
    try {
      await userService.create(values);
      toast.success('Staff account created');
      reset();
      setShowCreate(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', render: (u) => (
      <div>
        <p className="font-medium text-ink-900">{u.fullName}</p>
        <p className="text-xs text-ink-700/50">{u.email}</p>
      </div>
    ) },
    { key: 'role', header: 'Role', render: (u) => <Badge>{u.role}</Badge> },
    { key: 'matric', header: 'Matric No.', render: (u) => u.matricNumber || '—' },
    { key: 'status', header: 'Status', render: (u) => (
      <span className={u.isActive ? 'text-emerald-600 text-xs font-medium' : 'text-red-500 text-xs font-medium'}>
        {u.isActive ? 'Active' : 'Deactivated'}
      </span>
    ) },
    {
      key: 'actions',
      header: '',
      render: (u) => (
        <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(u)}>
          {u.isActive ? <Ban className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-emerald-600" />}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Users</h2>
          <p className="mt-1 text-sm text-ink-700/60">Manage students, wardens, and administrators.</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Add Staff Account
        </Button>
      </div>

      <div className="max-w-xs">
        <Select options={roleOptions} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} />
      </div>

      {loading ? (
        <PageLoader />
      ) : users.length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6" />} title="No users found" />
      ) : (
        <DataTable columns={columns} data={users} rowKey={(u) => u.id} />
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Staff Account (Warden / Admin)">
        <form onSubmit={handleSubmit(onCreate)} className="flex flex-col gap-4">
          <Input label="Full Name" required {...register('fullName')} />
          <Input label="Email Address" type="email" required {...register('email')} />
          <Input label="Temporary Password" type="password" required {...register('password')} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Gender" required options={[{ value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }]} {...register('gender')} />
            <Select label="Role" required options={[{ value: 'WARDEN', label: 'Warden' }, { value: 'ADMIN', label: 'Admin' }]} {...register('role')} />
          </div>
          <Input label="Phone Number" {...register('phone')} />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" isLoading={creating}>Create Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
