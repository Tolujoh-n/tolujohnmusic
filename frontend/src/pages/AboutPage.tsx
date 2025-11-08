import { useQuery } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';

const AboutPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['about'],
    queryFn: PublicAPI.getHome,
    select: (payload) => payload.about,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32">
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <h1 className="font-heading text-4xl font-semibold uppercase tracking-[0.6em] text-white">
          About Tolu John
        </h1>
        <p className="mt-6 text-sm text-slate-300">
          We’re curating this story. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-accent-300">About</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-widest text-white">
            {data.heading}
          </h1>
          {data.subheading && (
            <p className="mt-3 text-sm uppercase tracking-[0.35em] text-slate-400">{data.subheading}</p>
          )}
          <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-slate-200">
            {data.content}
          </p>
          {data.quote?.text && (
            <blockquote className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              “{data.quote.text}”
              <cite className="mt-3 block text-xs uppercase tracking-[0.35em] text-slate-400">
                {data.quote.attribution}
              </cite>
            </blockquote>
          )}
        </div>
        <div className="space-y-10">
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-elevated">
            <img
              src={
                data.featuredImage ||
                'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80'
              }
              alt="Tolu John"
              className="h-full w-full object-cover"
            />
          </div>
          {data.achievements && (
            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3">
              {data.achievements.map((achievement) => (
                <div
                  key={achievement.label}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-6"
                >
                  <p className="text-2xl font-semibold text-accent-200">{achievement.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-400">
                    {achievement.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

