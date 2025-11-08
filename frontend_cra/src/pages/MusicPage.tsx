import { useQuery } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';
import { FaExternalLinkAlt } from 'react-icons/fa';

const MusicPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['music'],
    queryFn: PublicAPI.getMusic,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-32">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-[4/5] animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 text-center">
        <h1 className="font-heading text-4xl font-semibold uppercase tracking-[0.6em] text-white">
          Music Catalogue
        </h1>
        <p className="mt-6 text-sm text-slate-300">We could not load the discography at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Music</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-widest text-white">
            Discography
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            A curated body of work that captures a journey of faith, resilience, and vibrant African
            expressions of worship.
          </p>
        </header>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((track) => (
            <article
              key={track._id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-elevated transition hover:-translate-y-1 hover:border-accent-400/40"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={
                    track.coverImage ||
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={track.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="font-heading text-2xl font-semibold text-white">{track.title}</h3>
                  {track.releaseDate && (
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {new Date(track.releaseDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <p className="text-sm text-slate-300 line-clamp-3">
                  {track.description || 'Experience the essence of this record today.'}
                </p>
                {track.genres && (
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                    {track.genres.map((genre) => (
                      <span key={genre} className="rounded-full border border-white/10 px-3 py-1">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-3">
                  {track.platforms?.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-accent-400 hover:text-accent-200"
                    >
                      {platform.name}
                      <FaExternalLinkAlt className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;

