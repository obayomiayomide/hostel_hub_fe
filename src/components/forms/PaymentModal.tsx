'use client';

import { useState } from 'react';
import { CheckCircle2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentService } from '@/services/payment.service';
import { getErrorMessage } from '@/lib/api';
import { Modal, Input, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Application } from '@/types';

interface PaymentModalProps {
  application: Application;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Simulates a hosted payment gateway checkout (Paystack/Flutterwave-style):
 * Step 1: student confirms an amount and "initiates" payment (creates a PENDING payment + reference).
 * Step 2: a mock checkout screen stands in for the real hosted payment page.
 * Step 3: student confirms payment, which calls the verify endpoint — this is the
 *         exact point a real gateway webhook/redirect would call in production.
 */
export function PaymentModal({ application, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'amount' | 'checkout' | 'success'>('amount');
  const [amount, setAmount] = useState('45000');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleInitiate() {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const result = await paymentService.initiate(application.id, numericAmount);
      setReference(result.reference);
      setStep('checkout');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      await paymentService.verify(reference);
      setStep('success');
      setTimeout(onSuccess, 1200);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Pay Hostel Fee" size="sm">
      {step === 'amount' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-700/70">
            You're paying for accommodation at <span className="font-medium text-ink-900">{application.hostel?.name}</span>.
          </p>
          <Input
            label="Amount (₦)"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Button onClick={handleInitiate} isLoading={loading} className="w-full">
            <CreditCard className="h-4 w-4" /> Continue to Payment
          </Button>
        </div>
      )}

      {step === 'checkout' && (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <CreditCard className="h-7 w-7" />
          </div>
          <div>
            <p className="font-medium text-ink-900">Simulated Payment Gateway</p>
            <p className="mt-1 text-sm text-ink-700/60">
              Reference: <span className="font-mono">{reference}</span>
            </p>
            <p className="mt-1 text-lg font-bold text-ink-900">{formatCurrency(amount)}</p>
          </div>
          <p className="text-xs text-ink-700/50">
            In production this step redirects to a real payment provider (e.g. Paystack). Click below to
            simulate a successful transaction.
          </p>
          <Button onClick={handleConfirm} isLoading={loading} className="w-full">
            Simulate Successful Payment
          </Button>
        </div>
      )}

      {step === 'success' && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="font-medium text-ink-900">Payment Confirmed!</p>
          <p className="text-sm text-ink-700/60">
            Your application has been approved and the system will allocate a bed space shortly.
          </p>
        </div>
      )}
    </Modal>
  );
}
