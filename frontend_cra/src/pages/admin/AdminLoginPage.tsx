import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ email: '', password: '' });

  const mutation = useMutation({
    mutationFn: () => AuthAPI.login(form.email, form.password),
    onSuccess: (payload) => {
      login(payload);
      const from = (location.state as { from?: Location })?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated">
        <p className="text-xs uppercase tracking-[0.4em] text-accent-300">Admin Console</p>
        <h1 className="mt-4 font-heading text-3xl font-semibold uppercase tracking-[0.4em] text-white">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-slate-300">Sign in to manage the Tolu John platform.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {mutation.isError && mutation.error instanceof Error && (
          <p className="mt-4 text-sm text-red-300">{mutation.error.message}</p>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;

