'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services';
import { initials } from '@/lib/utils';
import type { Notification } from '@/types';
import { MobileNav } from './MobileNav';

export function Topbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data, unreadCount: count } = await notificationService.getAll();
        if (mounted) {
          setNotifications(data);
          setUnreadCount(count);
        }
      } catch {
        // silently ignore — notifications are non-critical
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleMarkAllRead() {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }

  if (!user) return null;

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-ink-700/8 bg-white px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden rounded-lg p-1.5 text-ink-700 hover:bg-ink-700/5"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && <h1 className="font-display text-lg font-semibold text-ink-900">{title}</h1>}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative rounded-lg p-2 text-ink-700 hover:bg-ink-700/5"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl2 border border-ink-700/8 bg-white shadow-elevated">
                <div className="flex items-center justify-between border-b border-ink-700/8 px-4 py-3">
                  <p className="text-sm font-semibold text-ink-900">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs font-medium text-brand-600 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-ink-700/50">You're all caught up.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`border-b border-ink-700/6 px-4 py-3 last:border-0 ${!n.isRead ? 'bg-brand-50/50' : ''}`}
                      >
                        <p className="text-sm font-medium text-ink-900">{n.title}</p>
                        <p className="mt-0.5 text-xs text-ink-700/60">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-700/5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {initials(user.fullName)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-tight text-ink-900">{user.fullName}</p>
                <p className="text-[11px] leading-tight text-ink-700/50">{user.role}</p>
              </div>
              <ChevronDown className="hidden sm:block h-4 w-4 text-ink-700/40" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 z-30 mt-2 w-48 rounded-xl2 border border-ink-700/8 bg-white py-1.5 shadow-elevated">
                <a
                  href={user.role === 'STUDENT' ? '/student/profile' : '/admin/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-ink-800 hover:bg-ink-700/5"
                >
                  <UserIcon className="h-4 w-4" /> My Profile
                </a>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} role={user.role} />
    </>
  );
}
