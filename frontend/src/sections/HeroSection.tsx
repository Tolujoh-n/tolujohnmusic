import type { HeroHighlight } from '../types/content';

interface HeroSectionProps {
  hero?: HeroHighlight;
}

const HeroSection = ({ hero }: HeroSectionProps) => {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.65)), url('${
            hero?.backgroundImage ||
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1800&q=80'
          }')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-32 md:flex-row md:items-center md:gap-16 lg:py-40">
        <div className="max-w-2xl">
          <p className="uppercase tracking-[0.6em] text-sm text-accent-300">New Release</p>
          <h1 className="mt-6 font-heading text-5xl font-semibold uppercase leading-tight tracking-wider text-white md:text-6xl">
            {hero?.songTitle || 'Sound of Heaven'}
          </h1>
          <p className="mt-4 text-lg text-slate-200 md:text-xl">
            {hero?.tagline ||
              'Immerse yourself in a transcendent sonic journey crafted to ignite faith and hope.'}
          </p>
          {hero?.description && <p className="mt-3 text-base text-slate-300/90">{hero.description}</p>}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={hero?.ctaUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-accent-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-slate-950 shadow-elevated transition hover:bg-accent-400 disabled:pointer-events-none disabled:opacity-60"
            >
              {hero?.ctaLabel || 'Listen Now'}
            </a>
            {hero?.platforms?.slice(0, 4).map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-accent-400 hover:text-accent-200"
                target="_blank"
                rel="noreferrer"
              >
                {platform.name}
              </a>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-lg">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-accent-500/30 via-brand-500/20 to-transparent blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-elevated">
            <video
              className="h-full w-full object-cover"
              poster={hero?.backgroundImage}
              autoPlay
              loop
              muted
              playsInline
            >
              {hero?.audioPreviewUrl && <source src={hero.audioPreviewUrl} />}
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Featured Single</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-white">
                {hero?.songTitle || 'Sound of Heaven'}
              </h2>
              {hero?.releaseDate && (
                <p className="text-sm text-slate-300">
                  Released {new Date(hero.releaseDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

