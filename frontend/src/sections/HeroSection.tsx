import type { HeroHighlight } from '../types/content';

interface HeroSectionProps {
  hero?: HeroHighlight;
}

const HeroSection = ({ hero }: HeroSectionProps) => {
  const releaseDate = hero?.releaseDate
    ? new Date(hero.releaseDate).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Fresh release';

  const platformSummary =
    hero?.platforms && hero.platforms.length > 0
      ? hero.platforms
          .map((platform) => platform.name)
          .slice(0, 3)
          .join(' • ')
      : 'All major platforms';

  const stats = [
    { label: 'Release Date', value: releaseDate },
    { label: 'Available On', value: platformSummary },
    {
      label: 'Experience',
      value: hero?.ctaLabel ? hero.ctaLabel : 'Immersive Worship',
    },
  ];

  return (
    <section className="relative isolate -mt-24 flex min-h-screen items-center overflow-hidden pt-36 pb-20 sm:pt-40">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(8,15,36,0.95), rgba(36,99,255,0.55)), url('${
            hero?.backgroundImage ||
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1800&q=80'
          }')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/88 via-slate-950/45 to-slate-950/85" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="grid items-end gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="max-w-2xl pb-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.45em] text-white/90 backdrop-blur-md">
              Latest Release
              <span className="h-1.5 w-1.5 rounded-full bg-accent-300 shadow-[0_0_0_4px_rgba(255,146,26,0.25)]" />
            </div>
            <h1 className="mt-6 font-heading text-5xl font-semibold uppercase leading-tight tracking-[0.45em] text-white drop-shadow-2xl md:text-6xl">
            {hero?.songTitle || 'Sound of Heaven'}
          </h1>
            <p className="mt-6 text-lg text-white/80 md:text-xl">
            {hero?.tagline ||
              'Immerse yourself in a transcendent sonic journey crafted to ignite faith and hope.'}
          </p>
            {hero?.description && (
              <p className="mt-4 text-base text-white/70 md:text-lg">{hero.description}</p>
            )}

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a
                href={hero?.ctaUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-accent-400 px-8 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-slate-950 shadow-elevated transition hover:bg-accent-300 disabled:pointer-events-none disabled:opacity-60"
              >
              {hero?.ctaLabel || 'Listen Now'}
            </a>
            {hero?.platforms?.slice(0, 4).map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                className="rounded-full border border-white/25 px-5 py-2 text-xs font-semibold uppercase tracking-[0.45em] text-white/80 transition hover:border-accent-300 hover:text-accent-100"
                target="_blank"
                rel="noreferrer"
              >
                {platform.name}
              </a>
            ))}
          </div>

            <div className="mt-12 grid gap-6 text-white/80 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-6 backdrop-blur-sm transition hover:border-accent-300/30"
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">{stat.label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-lg">
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-accent-400/25 via-brand-500/20 to-transparent blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-elevated backdrop-blur">
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-[0.5em] text-white/60">Featured Single</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-white drop-shadow-lg">
                {hero?.songTitle || 'Sound of Heaven'}
              </h2>
                {hero?.releaseDate && (
                  <p className="text-sm text-white/70">Released {releaseDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

