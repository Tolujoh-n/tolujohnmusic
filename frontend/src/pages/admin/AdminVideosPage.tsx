import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Video } from '../../types/content';
import { AdminAPI } from '../../lib/api';

interface VideoFormState {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  releaseDate?: string;
  isFeatured?: boolean;
}

const emptyState: VideoFormState = {
  title: '',
  description: '',
  videoUrl: '',
  thumbnailUrl: '',
  releaseDate: '',
  isFeatured: false,
};

const toFormState = (video?: Video): VideoFormState =>
  video
    ? {
        title: video.title,
        description: video.description ?? '',
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl ?? '',
        releaseDate: video.releaseDate ? video.releaseDate.slice(0, 10) : '',
        isFeatured: Boolean(video.isFeatured),
      }
    : emptyState;

const AdminVideosPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: AdminAPI.listVideos,
  });

  const [form, setForm] = useState<VideoFormState>(emptyState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (editingId && data) {
      const video = data.find((item) => item._id === editingId);
      if (video) {
        setForm(toFormState(video));
      }
    }
  }, [editingId, data]);

  const createMutation = useMutation({
    mutationFn: () => AdminAPI.createVideo(form),
    onSuccess: () => {
      setForm(emptyState);
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => (editingId ? AdminAPI.updateVideo(editingId, form) : Promise.resolve(null)),
    onSuccess: () => {
      setEditingId(null);
      setForm(emptyState);
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminAPI.deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
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

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyState);
    createMutation.reset();
    updateMutation.reset();
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Video Library</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Manage Visual Catalogue
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Publish music videos, live performances, and storytelling experiences.
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

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
            YouTube or Vimeo URL *
          </label>
          <input
            type="url"
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
          />
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
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              value={form.thumbnailUrl}
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
            Feature on home page
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(createMutation.isSuccess || updateMutation.isSuccess) && (
            <p className="text-sm font-semibold text-accent-200">Video saved successfully.</p>
          )}
          {(createMutation.isError || updateMutation.isError) &&
            ((createMutation.error ?? updateMutation.error) instanceof Error) && (
              <p className="text-sm text-red-300">
                {(createMutation.error ?? updateMutation.error)?.message || 'Unable to save video.'}
              </p>
            )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : editingId ? 'Update Video' : 'Add Video'}
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
        <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Published Videos</h2>
        {isLoading && <div className="mt-4 h-32 animate-pulse rounded-3xl bg-white/5" />}
        {!isLoading && (!data || data.length === 0) && (
          <p className="mt-4 text-sm text-slate-400">No videos yet. Add the first visual above.</p>
        )}
        <div className="mt-6 space-y-4">
          {data?.map((video) => (
            <div
              key={video._id}
              className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-elevated md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {video.releaseDate ? new Date(video.releaseDate).toLocaleDateString() : 'Unreleased'}
                </p>
                <h3 className="mt-2 font-heading text-xl font-semibold text-white">{video.title}</h3>
                <p className="text-sm text-slate-300 line-clamp-2">{video.description}</p>
                {video.isFeatured && (
                  <span className="mt-3 inline-flex rounded-full border border-accent-300/40 px-3 py-1 text-xs uppercase tracking-[0.3em] text-accent-200">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(video._id);
                    setForm(toFormState(video));
                  }}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-accent-400 hover:text-accent-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(video._id)}
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

export default AdminVideosPage;

