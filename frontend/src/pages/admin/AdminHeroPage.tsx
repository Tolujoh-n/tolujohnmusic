import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '../../lib/api';

interface HeroFormState {
  songTitle: string;
  tagline: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl: string;
  backgroundImage?: string;
  releaseDate?: string;
  audioPreviewUrl?: string;
  platforms: { name: string; url: string }[];
}

const AdminHeroPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-hero'],
    queryFn: AdminAPI.getHero,
  });
  const [form, setForm] = useState<HeroFormState>({
    songTitle: '',
    tagline: '',
    description: '',
    ctaLabel: 'Listen Now',
    ctaUrl: '',
    backgroundImage: '',
    releaseDate: '',
    audioPreviewUrl: '',
    platforms: [{ name: '', url: '' }],
  });

  useEffect(() => {
    if (data) {
      setForm({
        songTitle: data.songTitle ?? '',
        tagline: data.tagline ?? '',
        description: data.description ?? '',
        ctaLabel: data.ctaLabel ?? 'Listen Now',
        ctaUrl: data.ctaUrl ?? '',
        backgroundImage: data.backgroundImage ?? '',
        releaseDate: data.releaseDate ? data.releaseDate.slice(0, 10) : '',
        audioPreviewUrl: data.audioPreviewUrl ?? '',
        platforms: data.platforms?.length ? data.platforms : [{ name: '', url: '' }],
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => AdminAPI.saveHero(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformChange = (index: number, field: 'name' | 'url', value: string) => {
    setForm((prev) => {
      const updated = [...prev.platforms];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, platforms: updated };
    });
  };

  const addPlatform = () => {
    setForm((prev) => ({
      ...prev,
      platforms: [...prev.platforms, { name: '', url: '' }],
    }));
  };

  const removePlatform = (index: number) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.filter((_, idx) => idx !== index),
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
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Hero Highlight</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Feature the Latest Release
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Update the main hero section with the current single or headline moment.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              Song Title *
            </label>
            <input
              type="text"
              name="songTitle"
              value={form.songTitle}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              Tagline *
            </label>
            <input
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              CTA Label
            </label>
            <input
              type="text"
              name="ctaLabel"
              value={form.ctaLabel}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              CTA URL *
            </label>
            <input
              type="url"
              name="ctaUrl"
              value={form.ctaUrl}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              Background Image URL
            </label>
            <input
              type="url"
              name="backgroundImage"
              value={form.backgroundImage}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              Release Date
            </label>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">
              Audio Preview URL
            </label>
            <input
              type="url"
              name="audioPreviewUrl"
              value={form.audioPreviewUrl}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Streaming Platforms</p>
            <button
              type="button"
              onClick={addPlatform}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300"
            >
              + Add platform
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {form.platforms.map((platform, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr,2fr,auto]"
              >
                <input
                  type="text"
                  value={platform.name}
                  onChange={(event) => handlePlatformChange(index, 'name', event.target.value)}
                  placeholder="Platform name"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
                <input
                  type="url"
                  value={platform.url}
                  onChange={(event) => handlePlatformChange(index, 'url', event.target.value)}
                  placeholder="Platform link"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
                {form.platforms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePlatform(index)}
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
            <p className="text-sm font-semibold text-accent-200">Hero updated successfully.</p>
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

export default AdminHeroPage;

