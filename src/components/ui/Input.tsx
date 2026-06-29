'use client';

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-800">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-700/60">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const baseFieldClasses =
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/40 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:bg-slate-25 disabled:text-ink-700/50';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required}>
        <input
          ref={ref}
          required={required}
          className={cn(baseFieldClasses, error ? 'border-red-400' : 'border-ink-700/15', className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, rows = 4, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required}>
        <textarea
          ref={ref}
          required={required}
          rows={rows}
          className={cn(baseFieldClasses, 'resize-none', error ? 'border-red-400' : 'border-ink-700/15', className)}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, className, options, placeholder, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} hint={hint} required={required}>
        <select
          ref={ref}
          required={required}
          className={cn(baseFieldClasses, 'cursor-pointer', error ? 'border-red-400' : 'border-ink-700/15', className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    );
  }
);
Select.displayName = 'Select';
