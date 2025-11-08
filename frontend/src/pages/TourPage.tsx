import { useQuery } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';

const TourPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tours'],
    queryFn: () => PublicAPI.getTours(true),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <h1 className="font-heading text-4xl font-semibold uppercase tracking-[0.6em] text-white">
          Tour Schedule
        </h1>
        <p className="mt-6 text-sm text-slate-300">
          Our tour schedule is being updated. Please check back shortly.
        </p>
      </div>
    );
  }

  const upcoming = data.filter((tour) => new Date(tour.date) >= new Date());
  const past = data.filter((tour) => new Date(tour.date) < new Date());

  return (
    <div className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Tour</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-widest text-white">
            Heaven on Earth Tour
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            Experience unforgettable worship nights across continents. Secure your seat and invite your
            community.
          </p>
        </header>

        <section className="mt-16 space-y-6">
          <h2 className="text-sm uppercase tracking-[0.4em] text-accent-200">Upcoming Stops</h2>
          {upcoming.length === 0 && (
            <p className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              No upcoming tour dates have been announced yet. Subscribe for the next announcement.
            </p>
          )}
          {upcoming.map((tour) => (
            <div
              key={tour._id}
              className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {new Date(tour.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-white">{tour.title}</h3>
                <p className="text-sm text-slate-300">
                  {tour.venue} · {tour.city}, {tour.country}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {tour.ticketUrl && (
                  <a
                    href={tour.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-accent-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400"
                  >
                    Tickets
                  </a>
                )}
                {tour.vipUrl && (
                  <a
                    href={tour.vipUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-accent-400 hover:text-accent-200"
                  >
                    VIP
                  </a>
                )}
                {tour.isSoldOut && (
                  <span className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>

        {past.length > 0 && (
          <section className="mt-16 space-y-6">
            <h2 className="text-sm uppercase tracking-[0.4em] text-slate-500">Past Highlights</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {past.map((tour) => (
                <div
                  key={tour._id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {new Date(tour.date).toLocaleDateString()}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold text-white">{tour.title}</h3>
                  <p>
                    {tour.venue} · {tour.city}, {tour.country}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TourPage;

