import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { mutateAsync, isPending, isSuccess, data, isError, error, reset } = useMutation({
    mutationFn: PublicAPI.contact,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync(form);
    setForm({ name: '', email: '', message: '' });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    if (isSuccess || isError) {
      reset();
    }
  };

  return (
    <div className="bg-slate-950 py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Contact</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-widest text-white">
            Let’s Create Moments
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            For bookings, collaborations, media inquiries, or partnership opportunities, send us a message
            and the team will respond promptly.
          </p>
          <div className="mt-10 space-y-6 text-sm text-slate-300">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Bookings & Management</p>
              <a
                href="mailto:booking@tolujohnmusic.com"
                className="mt-2 inline-block text-base text-white hover:text-accent-200"
              >
                booking@tolujohnmusic.com
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Press & Media</p>
              <a
                href="mailto:press@tolujohnmusic.com"
                className="mt-2 inline-block text-base text-white hover:text-accent-200"
              >
                press@tolujohnmusic.com
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Representation</p>
              <p className="mt-2 text-base text-white">SoulBridge Creative Agency</p>
              <p className="text-sm text-slate-400">Lagos · London · Atlanta</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.35em] text-slate-400">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-8 w-full rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {isPending ? 'Sending...' : 'Send Message'}
          </button>

          {isSuccess && data?.message && (
            <p className="mt-6 text-sm font-semibold text-accent-200">{data.message}</p>
          )}

          {isError && error instanceof Error && (
            <p className="mt-6 text-sm text-red-300">
              {error.message || 'Something went wrong. Please try again later.'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;

