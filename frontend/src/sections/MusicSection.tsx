import type { Track } from '../types/content';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface MusicSectionProps {
  tracks: Track[];
}

const MusicSection = ({ tracks }: MusicSectionProps) => {
  return (
    <section id="music" className="border-t border-white/5 bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Discography</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold uppercase tracking-widest text-white">
              Music Catalogue
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-slate-300">
              Discover the evolving soundscape of Tolu John — from intimate worship ballads to stadium-ready
              anthems that stir the soul.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tracks.length === 0 && (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
              New music is coming soon. Stay connected for the next release.
            </div>
          )}
          {tracks.map((track) => (
            <article
              key={track._id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-elevated transition hover:-translate-y-1 hover:border-accent-400/50"
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
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-accent-200">Single</p>
                  <h3 className="font-heading text-2xl font-semibold text-white">{track.title}</h3>
                  {track.releaseDate && (
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      {new Date(track.releaseDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <p className="text-sm text-slate-300 line-clamp-3">
                  {track.description || 'Experience the depth and color of this record.'}
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
    </section>
  );
};

export default MusicSection;

