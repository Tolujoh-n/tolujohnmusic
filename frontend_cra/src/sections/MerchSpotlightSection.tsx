import type { MerchItem } from '../types/content';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface MerchSpotlightSectionProps {
  items: MerchItem[];
}

const MerchSpotlightSection = ({ items }: MerchSpotlightSectionProps) => {
  if (items.length === 0) return null;

  return (
    <section id="merch" className="border-t border-white/5 bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Merch Drop</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold uppercase tracking-widest text-white">
              Official Merchandise
            </h2>
            <p className="mt-4 max-w-xl text-sm text-slate-300">
              Premium pieces inspired by the Heaven on Earth collection. Designed for the devoted.
            </p>
          </div>
          <a
            href="/merch"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-accent-400 hover:text-accent-200"
          >
            View Store
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item._id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-elevated transition hover:-translate-y-1 hover:border-accent-400/50"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1521572278905-1e8a9975f6f4?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {!item.inStock && (
                  <span className="absolute left-4 top-4 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <h3 className="font-heading text-2xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-300 line-clamp-3">
                  {item.description || 'Limited edition piece from the official tour collection.'}
                </p>
                <p className="text-lg font-bold text-accent-200">${item.price.toFixed(2)}</p>
                <div className="mt-auto">
                  <a
                    href={item.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
                  >
                    Shop now
                    <FaExternalLinkAlt className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchSpotlightSection;

