import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const AdminProfilePage = () => {
  const updateStore = useAuthStore((state) => state.login);
  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: AuthAPI.getProfile,
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
      }));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      AuthAPI.updateProfile({
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      }),
    onSuccess: (updated) => {
      updateStore({ admin: updated, token: useAuthStore.getState().token! });
      setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Profile</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Account Settings
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Update your personal details and secure your admin access.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="Required to set new password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {mutation.isSuccess && (
            <p className="text-sm font-semibold text-accent-200">Profile updated successfully.</p>
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

export default AdminProfilePage;

