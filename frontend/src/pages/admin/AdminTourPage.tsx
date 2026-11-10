import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TourDate } from '../../types/content';
import { AdminAPI } from '../../lib/api';

interface TourFormState {
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  isTicketed: boolean;
  ticketUrl: string;
  enableVip: boolean;
  vipUrl: string;
  isSoldOut: boolean;
}

const emptyState: TourFormState = {
  title: '',
  venue: '',
  city: '',
  country: '',
  date: '',
  isTicketed: true,
  ticketUrl: '',
  enableVip: false,
  vipUrl: '',
  isSoldOut: false,
};

const toFormState = (tour?: TourDate): TourFormState =>
  tour
    ? {
        title: tour.title,
        venue: tour.venue,
        city: tour.city,
        country: tour.country,
        date: tour.date ? tour.date.slice(0, 10) : '',
        isTicketed: tour.isTicketed !== false,
        ticketUrl: tour.ticketUrl ?? '',
        enableVip: Boolean(tour.vipUrl),
        vipUrl: tour.vipUrl ?? '',
        isSoldOut: Boolean(tour.isSoldOut),
      }
    : emptyState;

const AdminTourPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tours'],
    queryFn: AdminAPI.listTours,
  });

  const [form, setForm] = useState<TourFormState>(emptyState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (editingId && data) {
      const tour = data.find((item) => item._id === editingId);
      if (tour) {
        setForm(toFormState(tour));
      }
    }
  }, [editingId, data]);

  const buildPayload = () => {
    const isTicketed = form.isTicketed;
    return {
      title: form.title,
      venue: form.venue,
      city: form.city,
      country: form.country,
      date: form.date,
      isTicketed,
      ticketUrl: isTicketed ? form.ticketUrl.trim() : '',
      vipUrl: isTicketed && form.enableVip ? form.vipUrl.trim() : '',
      isSoldOut: isTicketed ? form.isSoldOut : false,
    };
  };

  const createMutation = useMutation({
    mutationFn: () => AdminAPI.createTour(buildPayload()),
    onSuccess: () => {
      setForm(emptyState);
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      editingId ? AdminAPI.updateTour(editingId, buildPayload()) : Promise.resolve(null),
    onSuccess: () => {
      setEditingId(null);
      setForm(emptyState);
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminAPI.deleteTour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target;
    const { name, value } = target;
    const nextValue =
      target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : value;

    setForm((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === 'isTicketed' && nextValue === false) {
        next.enableVip = false;
        next.vipUrl = '';
        next.ticketUrl = '';
        next.isSoldOut = false;
      }
      if (name === 'enableVip' && nextValue === false) {
        next.vipUrl = '';
      }
      return next;
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyState);
    createMutation.reset();
    updateMutation.reset();
  };

  const mutationError = createMutation.error ?? updateMutation.error;

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Tour Schedule</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Plan Live Experiences
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Create free or ticketed stops. VIP is optional and only appears when you set a VIP link.
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
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Venue *</label>
            <input
              type="text"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">City *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Country *</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
            Event Access *
          </label>
          <select
            name="isTicketed"
            value={form.isTicketed ? 'ticketed' : 'free'}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                isTicketed: event.target.value === 'ticketed',
                ...(event.target.value === 'free'
                  ? { enableVip: false, vipUrl: '', ticketUrl: '', isSoldOut: false }
                  : {}),
              }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30 md:max-w-md"
          >
            <option value="ticketed">Ticketed event</option>
            <option value="free">Free entry</option>
          </select>
        </div>

        {form.isTicketed && (
          <div className="space-y-6 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Tickets URL *
              </label>
              <input
                type="url"
                name="ticketUrl"
                value={form.ticketUrl}
                onChange={handleChange}
                required={form.isTicketed}
                placeholder="https://..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>

            <label className="inline-flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                name="enableVip"
                checked={form.enableVip}
                onChange={handleChange}
                className="h-4 w-4 rounded border border-white/20 bg-transparent text-accent-400"
              />
              Offer VIP tickets
            </label>

            {form.enableVip && (
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  VIP URL *
                </label>
                <input
                  type="url"
                  name="vipUrl"
                  value={form.vipUrl}
                  onChange={handleChange}
                  required={form.enableVip}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
            )}

            <label className="inline-flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                name="isSoldOut"
                checked={form.isSoldOut}
                onChange={handleChange}
                className="h-4 w-4 rounded border border-white/20 bg-transparent text-accent-400"
              />
              Mark as sold out
            </label>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {(createMutation.isSuccess || updateMutation.isSuccess) && (
            <p className="text-sm font-semibold text-accent-200">Tour date saved.</p>
          )}
          {mutationError && (
            <p className="text-sm text-red-300">
              {(mutationError as { response?: { data?: { message?: string } } })?.response?.data
                ?.message ||
                (mutationError instanceof Error
                  ? mutationError.message
                  : 'Unable to save tour date.')}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : editingId ? 'Update Date' : 'Add Date'}
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
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Tour Dates</h2>
        {isLoading && <div className="mt-4 h-32 animate-pulse rounded-3xl bg-white/5" />}
        {!isLoading && (!data || data.length === 0) && (
          <p className="mt-4 text-sm text-slate-400">No tour dates yet. Start planning above.</p>
        )}
        <div className="mt-6 space-y-4">
          {data?.map((tour) => (
            <div
              key={tour._id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-elevated md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {new Date(tour.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-white">{tour.title}</h3>
                <p className="text-sm text-slate-300">
                  {tour.venue} · {tour.city}, {tour.country}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                  {tour.isTicketed === false
                    ? 'Free entry'
                    : tour.vipUrl
                      ? 'Ticketed · VIP available'
                      : 'Ticketed'}
                </p>
                {tour.isSoldOut && (
                  <span className="mt-3 inline-flex rounded-full border border-red-300/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-red-300">
                    Sold Out
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(tour._id);
                    setForm(toFormState(tour));
                  }}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-accent-400 hover:text-accent-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(tour._id)}
                  className="rounded-full border border-red-500/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-300"
                >
                  {deleteMutation.isPending ? 'Removing…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminTourPage;
