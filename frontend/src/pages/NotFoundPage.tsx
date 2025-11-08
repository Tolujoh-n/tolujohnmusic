import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.5em] text-accent-300">404</p>
      <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-widest text-white">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-sm text-slate-300">
        Looks like we played the wrong chord. Let’s take you back to the main stage.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-accent-400 hover:text-accent-200"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

