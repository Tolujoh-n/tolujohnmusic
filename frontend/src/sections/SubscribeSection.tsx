import { FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';

const SubscribeSection = () => {
  const [email, setEmail] = useState('');
  const { mutateAsync, isPending, isSuccess, data, isError, error, reset } = useMutation({
    mutationFn: PublicAPI.subscribe,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    await mutateAsync(email);
    setEmail('');
  };

  return (
    <section id="subscribe" className="border-y border-white/5 bg-slate-950 py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Stay Connected</p>
        <h2 className="mt-4 font-heading text-4xl font-semibold uppercase tracking-widest text-white">
          Join the Inner Circle
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300">
          Receive exclusive stories, tour announcements, and early access to new music from Tolu John.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (isSuccess || isError) {
                reset();
              }
            }}
            placeholder="Enter your email address"
            required
            className="w-full max-w-md rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm text-white placeholder:text-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/40"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-accent-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {isPending ? 'Joining...' : 'Subscribe'}
          </button>
        </form>

        {isSuccess && data?.message && (
          <p className="mt-6 text-sm font-semibold text-accent-200">{data.message}</p>
        )}

        {isError && error instanceof Error && (
          <p className="mt-6 text-sm text-red-300">
            {error.message || 'Something went wrong. Please try again.'}
          </p>
        )}
      </div>
    </section>
  );
};

export default SubscribeSection;

