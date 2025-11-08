import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '../../lib/api';

interface Achievement {
  label: string;
  value: string;
}

interface AboutFormState {
  heading: string;
  subheading?: string;
  content: string;
  featuredImage?: string;
  quoteText?: string;
  quoteAttribution?: string;
  achievements: Achievement[];
}

const AdminAboutPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-about'],
    queryFn: AdminAPI.getAbout,
  });

  const [form, setForm] = useState<AboutFormState>({
    heading: '',
    subheading: '',
    content: '',
    featuredImage: '',
    quoteText: '',
    quoteAttribution: '',
    achievements: [{ label: '', value: '' }],
  });

  useEffect(() => {
    if (data) {
      setForm({
        heading: data.heading ?? '',
        subheading: data.subheading ?? '',
        content: data.content ?? '',
        featuredImage: data.featuredImage ?? '',
        quoteText: data.quote?.text ?? '',
        quoteAttribution: data.quote?.attribution ?? '',
        achievements: data.achievements?.length
          ? data.achievements
          : [{ label: 'Streams', value: '0' }],
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      AdminAPI.saveAbout({
        heading: form.heading,
        subheading: form.subheading,
        content: form.content,
        featuredImage: form.featuredImage,
        quote: { text: form.quoteText, attribution: form.quoteAttribution },
        achievements: form.achievements.filter((item) => item.label && item.value),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-about'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
    setForm((prev) => {
      const updated = [...prev.achievements];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, achievements: updated };
    });
  };

  const addAchievement = () => {
    setForm((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { label: '', value: '' }],
    }));
  };

  const removeAchievement = (index: number) => {
    setForm((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  if (isLoading && !data) {
    return <div className="h-48 animate-pulse rounded-3xl bg-white/5" />;
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">About Section</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Craft the Artist Story
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Update the biography, highlights, and hero imagery for the about page.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Heading *</label>
            <input
              type="text"
              name="heading"
              value={form.heading}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Subheading</label>
            <input
              type="text"
              name="subheading"
              value={form.subheading}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Content *</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={6}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              Featured Image URL
            </label>
            <input
              type="url"
              name="featuredImage"
              value={form.featuredImage}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Quote</label>
            <textarea
              name="quoteText"
              value={form.quoteText}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
            <input
              type="text"
              name="quoteAttribution"
              value={form.quoteAttribution}
              onChange={handleChange}
              placeholder="Attribution"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Achievements</p>
            <button
              type="button"
              onClick={addAchievement}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300"
            >
              + Add row
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {form.achievements.map((achievement, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[2fr,1fr,auto]"
              >
                <input
                  type="text"
                  value={achievement.label}
                  onChange={(event) => updateAchievement(index, 'label', event.target.value)}
                  placeholder="Label"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
                <input
                  type="text"
                  value={achievement.value}
                  onChange={(event) => updateAchievement(index, 'value', event.target.value)}
                  placeholder="Value"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
                {form.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {mutation.isSuccess && (
            <p className="text-sm font-semibold text-accent-200">About section updated.</p>
          )}
          {mutation.isError && mutation.error instanceof Error && (
            <p className="text-sm text-red-300">{mutation.error.message}</p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAboutPage;

