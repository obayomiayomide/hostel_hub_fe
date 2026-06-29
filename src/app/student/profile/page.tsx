'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/api';
import { Card, CardBody, CardHeader, CardTitle, Input, Button } from '@/components/ui';
import { initials } from '@/lib/utils';

interface ProfileForm {
  fullName: string;
  phone: string;
  department: string;
  level: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function StudentProfilePage() {
  const { user, refreshUser } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      department: user?.department || '',
      level: user?.level || '',
    },
  });

  const passwordForm = useForm<PasswordForm>();

  async function onProfileSubmit(values: ProfileForm) {
    setSavingProfile(true);
    try {
      await authService.updateProfile(values);
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  async function onPasswordSubmit(values: PasswordForm) {
    if (values.newPassword !== values.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword(values.currentPassword, values.newPassword);
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
          {initials(user.fullName)}
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900">{user.fullName}</h2>
          <p className="text-sm text-ink-700/60">{user.email} · {user.matricNumber}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex flex-col gap-4">
            <Input label="Full Name" {...profileForm.register('fullName')} />
            <Input label="Phone Number" {...profileForm.register('phone')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Department" {...profileForm.register('department')} />
              <Input label="Level" {...profileForm.register('level')} />
            </div>
            <Button type="submit" isLoading={savingProfile} className="w-fit">
              Save Changes
            </Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-4">
            <Input label="Current Password" type="password" required {...passwordForm.register('currentPassword')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="New Password" type="password" required {...passwordForm.register('newPassword')} />
              <Input label="Confirm New Password" type="password" required {...passwordForm.register('confirmPassword')} />
            </div>
            <Button type="submit" isLoading={savingPassword} className="w-fit">
              Update Password
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
