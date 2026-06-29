'use client';

import { Fragment, ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Fragment>
      <div
        className="fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'w-full rounded-xl2 bg-white shadow-elevated max-h-[90vh] overflow-y-auto',
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-ink-700/8 px-5 py-4">
              <h3 className="font-display text-base font-semibold text-ink-900">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-ink-700/50 hover:bg-ink-700/5 hover:text-ink-900"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          <div className="p-5">{children}</div>
        </div>
      </div>
    </Fragment>
  );
}
