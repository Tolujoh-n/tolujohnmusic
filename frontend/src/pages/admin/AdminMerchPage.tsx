import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CurrencyCode, MerchCtaType, MerchItem } from '../../types/content';
import { AdminAPI } from '../../lib/api';
import ImageUploadField from '../../components/ImageUploadField';
import { formatMoney, resolveMerchPrice } from '../../lib/currency';

interface MerchFormState {
  title: string;
  description?: string;
  priceUsd: string;
  priceNgn: string;
  defaultCurrency: CurrencyCode;
  imageUrl?: string;
  ctaType: MerchCtaType;
  productUrl: string;
  inStock?: boolean;
  tags: string;
}

const emptyState: MerchFormState = {
  title: '',
  description: '',
  priceUsd: '',
  priceNgn: '',
  defaultCurrency: 'USD',
  imageUrl: '',
  ctaType: 'link',
  productUrl: '',
  inStock: true,
  tags: '',
};

const toFormState = (item?: MerchItem): MerchFormState =>
  item
    ? {
        title: item.title,
        description: item.description ?? '',
        priceUsd:
          item.priceUsd !== undefined
            ? String(item.priceUsd)
            : item.defaultCurrency !== 'NGN' && item.price !== undefined
              ? String(item.price)
              : '',
        priceNgn:
          item.priceNgn !== undefined
            ? String(item.priceNgn)
            : item.defaultCurrency === 'NGN' && item.price !== undefined
              ? String(item.price)
              : '',
        defaultCurrency: item.defaultCurrency || 'USD',
        imageUrl: item.imageUrl ?? '',
        ctaType: item.ctaType || 'link',
        productUrl: item.productUrl ?? '',
        inStock: item.inStock,
        tags: item.tags?.join(', ') ?? '',
      }
    : emptyState;

const AdminMerchPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-merch'],
    queryFn: AdminAPI.listMerch,
  });

  const [form, setForm] = useState<MerchFormState>(emptyState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (editingId && data) {
      const item = data.find((entry) => entry._id === editingId);
      if (item) {
        setForm(toFormState(item));
      }
    }
  }, [editingId, data]);

  const buildPayload = () => ({
    title: form.title,
    description: form.description,
    priceUsd: form.priceUsd === '' ? null : Number(form.priceUsd),
    priceNgn: form.priceNgn === '' ? null : Number(form.priceNgn),
    defaultCurrency: form.defaultCurrency,
    imageUrl: form.imageUrl,
    ctaType: form.ctaType,
    productUrl: form.ctaType === 'link' ? form.productUrl : form.productUrl || '',
    inStock: form.inStock,
    tags: form.tags ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
  });

  const createMutation = useMutation({
    mutationFn: () => AdminAPI.createMerch(buildPayload()),
    onSuccess: () => {
      setForm(emptyState);
      queryClient.invalidateQueries({ queryKey: ['admin-merch'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['merch'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      editingId ? AdminAPI.updateMerch(editingId, buildPayload()) : Promise.resolve(null),
    onSuccess: () => {
      setEditingId(null);
      setForm(emptyState);
      queryClient.invalidateQueries({ queryKey: ['admin-merch'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['merch'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminAPI.deleteMerch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-merch'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['merch'] });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editingId) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const { name, value } = target;

    const nextValue =
      target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyState);
    createMutation.reset();
    updateMutation.reset();
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Merchandise</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Curate the Storefront
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Set pricing in Naira or Dollar, choose link or shipping-form CTAs, and upload product images.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Default Currency *
            </label>
            <select
              name="defaultCurrency"
              value={form.defaultCurrency}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            >
              <option value="USD">Dollar (USD)</option>
              <option value="NGN">Naira (NGN)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="priceUsd"
              value={form.priceUsd}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Price (NGN)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              name="priceNgn"
              value={form.priceNgn}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Set one or both prices so visitors can switch between Naira and Dollar on the storefront.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Get it Now Action *
            </label>
            <select
              name="ctaType"
              value={form.ctaType}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            >
              <option value="link">Redirect to link</option>
              <option value="form">Collect shipping form</option>
            </select>
          </div>
          {form.ctaType === 'link' ? (
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Redirect Link *
              </label>
              <input
                type="url"
                name="productUrl"
                value={form.productUrl}
                onChange={handleChange}
                required={form.ctaType === 'link'}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              Visitors will fill a shipping details modal. Submissions appear under Merch Orders.
            </div>
          )}
        </div>

        <ImageUploadField
          label="Product Image"
          value={form.imageUrl}
          onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
        />

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <label className="mt-7 inline-flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="h-4 w-4 rounded border border-white/20 bg-transparent text-accent-400"
            />
            In stock
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(createMutation.isSuccess || updateMutation.isSuccess) && (
            <p className="text-sm font-semibold text-accent-200">Merch item saved.</p>
          )}
          {(createMutation.isError || updateMutation.isError) &&
            ((createMutation.error ?? updateMutation.error) instanceof Error) && (
              <p className="text-sm text-red-300">
                {(
                  (createMutation.error ?? updateMutation.error) as {
                    response?: { data?: { message?: string } };
                  }
                )?.response?.data?.message ||
                  (createMutation.error ?? updateMutation.error)?.message ||
                  'Unable to save merch item.'}
              </p>
            )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white transition hover:border-accent-400 hover:text-accent-200"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section>
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Merch Catalogue</h2>
        {isLoading && <div className="mt-4 h-32 animate-pulse rounded-3xl bg-white/5" />}
        {!isLoading && (!data || data.length === 0) && (
          <p className="mt-4 text-sm text-slate-400">No merch items yet. Add the first piece above.</p>
        )}
        <div className="mt-6 space-y-4">
          {data?.map((item) => {
            const usd = resolveMerchPrice(item, 'USD');
            const ngn = resolveMerchPrice(item, 'NGN');
            return (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-elevated md:flex-row md:items-center md:justify-between"
              >
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="hidden h-20 w-20 rounded-2xl object-cover sm:block"
                    />
                  )}
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-slate-300 line-clamp-2">{item.description}</p>
                    <p className="mt-2 text-sm font-semibold text-accent-200">
                      {usd !== null ? formatMoney(usd, 'USD') : '—'}
                      {' · '}
                      {ngn !== null ? formatMoney(ngn, 'NGN') : '—'}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                      CTA: {item.ctaType === 'form' ? 'Shipping form' : 'External link'}
                    </p>
                    {!item.inStock && (
                      <span className="mt-3 inline-flex rounded-full border border-red-300/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-red-300">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(item._id);
                      setForm(toFormState(item));
                    }}
                    className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-accent-400 hover:text-accent-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(item._id)}
                    className="rounded-full border border-red-500/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-300"
                  >
                    {deleteMutation.isPending ? 'Removing…' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AdminMerchPage;
