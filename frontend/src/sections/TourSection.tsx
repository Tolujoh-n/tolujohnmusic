import type { TourDate } from '../types/content';

interface TourSectionProps {
  tourDates: TourDate[];
}

const TourSection = ({ tourDates }: TourSectionProps) => {
  return (
    <section id="tour" className="border-t border-white/5 bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.5em] text-accent-300">On Tour</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold uppercase tracking-widest text-white">
              Upcoming Experiences
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-400">
              Join Tolu John in immersive nights of worship across the globe. Secure your tickets early
              to experience the Heaven on Earth Tour.
            </p>
          </div>
          <a
            href="#tickets"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-accent-400 hover:text-accent-200"
          >
            View All Dates
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {tourDates.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
              More tour dates will be announced soon. Subscribe to be the first to know.
            </div>
          )}
          {tourDates.map((tour) => (
            <div
              key={tour._id}
              className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-elevated transition hover:-translate-y-1 hover:border-accent-400/60"
            >
              <div className="flex items-center gap-6">
                <div className="rounded-2xl bg-slate-900 px-4 py-3 text-center uppercase tracking-[0.3em] text-accent-200">
                  <p className="text-sm font-semibold">
                    {new Date(tour.date).toLocaleDateString(undefined, {
                      month: 'short',
                    })}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {new Date(tour.date).toLocaleDateString(undefined, {
                      day: '2-digit',
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="font-heading text-xl font-semibold text-white">{tour.title}</h3>
                  <p className="text-sm text-slate-300">
                    {tour.venue} · {tour.city}, {tour.country}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-400">
                    {new Date(tour.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {tour.ticketUrl && !tour.isSoldOut && (
                  <a
                    href={tour.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-accent-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:bg-accent-400"
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
                    VIP Experience
                  </a>
                )}
                {tour.isSoldOut && (
                  <span className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-red-300">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourSection;

