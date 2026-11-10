import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';
import type { CurrencyCode, MerchItem } from '../types/content';
import { formatMoney, resolveMerchPrice } from '../lib/currency';

interface MerchOrderModalProps {
  item: MerchItem;
  currency: CurrencyCode;
  open: boolean;
  onClose: () => void;
}

interface OrderFormState {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  quantity: number;
  notes: string;
}

const emptyForm: OrderFormState = {
  name: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  quantity: 1,
  notes: '',
};

const MerchOrderModal = ({ item, currency, open, onClose }: MerchOrderModalProps) => {
  const [form, setForm] = useState<OrderFormState>(emptyForm);
  const price = resolveMerchPrice(item, currency);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, item._id]);

  const mutation = useMutation({
    mutationFn: () =>
      PublicAPI.submitMerchOrder({
        merchItemId: item._id,
        ...form,
        currency,
      }),
  });

  if (!open) return null;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-elevated sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Shipping Request</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-300">
              No payment required now. Share your shipping details and the team will follow up.
            </p>
            {price !== null && (
              <p className="mt-3 text-lg font-semibold text-accent-200">
                {formatMoney(price, currency)}
                {form.quantity > 1 ? ` × ${form.quantity}` : ''}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
          >
            Close
          </button>
        </div>

        {mutation.isSuccess ? (
          <div className="mt-8 rounded-2xl border border-accent-400/30 bg-accent-500/10 p-6">
            <p className="text-sm font-semibold text-accent-200">
              {mutation.data?.message || 'Request submitted successfully.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-full bg-accent-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Full Name *
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Phone *
                </label>
                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Quantity *
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Address Line 1 *
              </label>
              <input
                required
                name="addressLine1"
                value={form.addressLine1}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Address Line 2
              </label>
              <input
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  City *
                </label>
                <input
                  required
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  State / Region *
                </label>
                <input
                  required
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Country *
                </label>
                <input
                  required
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Postal Code
                </label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Size, color preference, delivery notes…"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none"
              />
            </div>

            {mutation.isError && (
              <p className="text-sm text-red-300">
                {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data
                  ?.message ||
                  (mutation.error instanceof Error
                    ? mutation.error.message
                    : 'Unable to submit request.')}
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-full bg-accent-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
            >
              {mutation.isPending ? 'Submitting…' : 'Submit Shipping Details'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MerchOrderModal;
