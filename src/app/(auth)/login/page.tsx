'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth, dashboardPathForRole } from '@/context/AuthContext';
import { Input, Button } from '@/components/ui';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormData) {
    setSubmitting(true);
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      router.push(dashboardPathForRole(user.role));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-xl font-bold text-ink-900">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-700/60">Log in to manage your hostel application.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@school.edu"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" className="mt-1 w-full" isLoading={submitting}>
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-700/60">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-brand-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
