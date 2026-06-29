'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';

/**
 * Guards a page behind authentication, optionally restricting to specific roles.
 * Redirects to /login if not authenticated, or to the user's own dashboard
 * if authenticated but not permitted to view this page.
 */
export function useRequireAuth(allowedRoles?: Role[]) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(user.role === 'STUDENT' ? '/student/dashboard' : '/admin/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  return { user, isLoading };
}
