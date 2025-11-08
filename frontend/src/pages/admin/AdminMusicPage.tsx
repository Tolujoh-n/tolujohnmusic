import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Track } from '../../types/content';
import { AdminAPI } from '../../lib/api';

interface TrackFormState {
  title: string;
  description?: string;
  coverImage?: string;
  audioUrl?: string;
  releaseDate?: string;
  isFeatured?: boolean;
  genres: string;
  platforms: { name: string; url: string }[];
}

const emptyState: TrackFormState = {
  title: '',
  description: '',
  coverImage: '',
  audioUrl: '',
  releaseDate: '',
  isFeatured: false,
  genres: '',
  platforms: [{ name: '', url: '' }],
};

const toFormState = (track?: Track): TrackFormState =>
  track
    ? {
        title: track.title,
        description: track.description ?? '',
        coverImage: track.coverImage ?? '',
        audioUrl: track.audioUrl ?? '',
        releaseDate: track.releaseDate ? track.releaseDate.slice(0, 10) : '',
        isFeatured: Boolean(track.isFeatured),
        genres: track.genres?.join(', ') ?? '',
        platforms: track.platforms?.length ? track.platforms : [{ name: '', url: '' }],
      }
    : emptyState;

const AdminMusicPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tracks'],
    queryFn: AdminAPI.listTracks,
  });

  const [form, setForm] = useState<TrackFormState>(emptyState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (editingId && data) {
      const track = data.find((item) => item._id === editingId);
      if (track) {
        setForm(toFormState(track));
      }
    }
  }, [editingId, data]);

  const createMutation = useMutation({
    mutationFn: () =>
      AdminAPI.createTrack({
        title: form.title,
        description: form.description,
        coverImage: form.coverImage,
        audioUrl: form.audioUrl,
        releaseDate: form.releaseDate,
        isFeatured: form.isFeatured,
        genres: form.genres ? form.genres.split(',').map((g) => g.trim()) : [],
        platforms: form.platforms.filter((item) => item.name && item.url),
      }),
    onSuccess: () => {
      setForm(emptyState);
      queryClient.invalidateQueries({ queryKey: ['admin-tracks'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['music'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      editingId
        ? AdminAPI.updateTrack(editingId, {
            title: form.title,
            description: form.description,
            coverImage: form.coverImage,
            audioUrl: form.audioUrl,
            releaseDate: form.releaseDate,
            isFeatured: form.isFeatured,
            genres: form.genres ? form.genres.split(',').map((g) => g.trim()) : [],
            platforms: form.platforms.filter((item) => item.name && item.url),
          })
        : Promise.resolve(null),
    onSuccess: () => {
      setEditingId(null);
      setForm(emptyState);
      queryClient.invalidateQueries({ queryKey: ['admin-tracks'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['music'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminAPI.deleteTrack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tracks'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['music'] });
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const updatePlatform = (index: number, field: 'name' | 'url', value: string) => {
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

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyState);
    createMutation.reset();
    updateMutation.reset();
  };

  const tracks = useMemo(() => data ?? [], [data]);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Music Manager</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Manage Discography
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Create, feature, and organize Tolu John’s singles and albums.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Title *
            </label>
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
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Audio URL</label>
            <input
              type="url"
              name="audioUrl"
              value={form.audioUrl}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

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
              Genres (comma separated)
            </label>
            <input
              type="text"
              name="genres"
              value={form.genres}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <label className="mt-7 inline-flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 rounded border border-white/20 bg-transparent text-accent-400"
            />
            Featured on home page
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Platforms</p>
            <button
              type="button"
              onClick={addPlatform}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300"
            >
              + Add
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {form.platforms.map((platform, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr,2fr,auto]"
              >
                <input
                  type="text"
                  value={platform.name}
                  onChange={(event) => updatePlatform(index, 'name', event.target.value)}
                  placeholder="Platform"
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
                <input
                  type="url"
                  value={platform.url}
                  onChange={(event) => updatePlatform(index, 'url', event.target.value)}
                  placeholder="URL"
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

        <div className="flex flex-wrap items-center gap-3">
          {(createMutation.isSuccess || updateMutation.isSuccess) && (
            <p className="text-sm font-semibold text-accent-200">Track saved successfully.</p>
          )}
          {(createMutation.isError || updateMutation.isError) &&
            ((createMutation.error ?? updateMutation.error) instanceof Error) && (
              <p className="text-sm text-red-300">
                {(createMutation.error ?? updateMutation.error)?.message || 'Unable to save track.'}
              </p>
            )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : editingId ? 'Update Track' : 'Create Track'}
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
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Existing Tracks</h2>
        {isLoading && <div className="mt-4 h-32 animate-pulse rounded-3xl bg-white/5" />}
        {!isLoading && tracks.length === 0 && (
          <p className="mt-4 text-sm text-slate-400">No tracks yet. Create the first record above.</p>
        )}
        <div className="mt-6 space-y-4">
          {tracks.map((track) => (
            <div
              key={track._id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-elevated md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {track.releaseDate ? new Date(track.releaseDate).toLocaleDateString() : 'Unreleased'}
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-white">{track.title}</h3>
                <p className="text-sm text-slate-300 line-clamp-2">{track.description}</p>
                {track.isFeatured && (
                  <span className="mt-3 inline-flex rounded-full border border-accent-300/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-accent-200">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(track._id);
                    setForm(toFormState(track));
                  }}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-accent-400 hover:text-accent-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(track._id)}
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

export default AdminMusicPage;

