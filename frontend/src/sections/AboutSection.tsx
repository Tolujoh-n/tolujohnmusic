import type { AboutContent } from '../types/content';

interface AboutSectionProps {
  about?: AboutContent;
}

const AboutSection = ({ about }: AboutSectionProps) => {
  if (!about) {
    return null;
  }

  return (
    <section id="about" className="border-t border-white/5 bg-slate-950 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-accent-300">About</p>
          <h2 className="mt-3 font-heading text-4xl font-semibold uppercase tracking-widest text-white">
            {about.heading}
          </h2>
          {about.subheading && (
            <p className="mt-2 text-sm uppercase tracking-[0.4em] text-slate-400">{about.subheading}</p>
          )}
          <p className="mt-6 text-base text-slate-200 leading-relaxed whitespace-pre-line">
            {about.content}
          </p>
          {about.quote?.text && (
            <blockquote className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              “{about.quote.text}”
              <cite className="mt-3 block text-xs uppercase tracking-[0.35em] text-slate-400">
                {about.quote.attribution}
              </cite>
            </blockquote>
          )}
          {about.achievements && (
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
              {about.achievements.map((achievement) => (
                <div
                  key={achievement.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center"
                >
                  <p className="text-2xl font-semibold text-accent-200">{achievement.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.4em] text-slate-400">
                    {achievement.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-brand-500/20 via-transparent to-transparent blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-elevated">
            <img
              src={
                about.featuredImage ||
                'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80'
              }
              alt="Tolu John in concert"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Live Performance</p>
              <p className="font-heading text-2xl font-semibold text-white">Moments of Encounter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

