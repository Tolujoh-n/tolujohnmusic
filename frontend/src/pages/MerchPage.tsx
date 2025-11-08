import { useQuery } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';
import { FaExternalLinkAlt } from 'react-icons/fa';

const MerchPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['merch'],
    queryFn: PublicAPI.getMerch,
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
          Merch Store
        </h1>
        <p className="mt-6 text-sm text-slate-300">We could not load the merch collection.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.5em] text-accent-300">Merch</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold uppercase tracking-widest text-white">
            Official Collection
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            Wear the movement. Every piece is crafted for those who believe music can shift atmospheres.
          </p>
        </header>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <article
              key={item._id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-elevated transition hover:-translate-y-1 hover:border-accent-400/50"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
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
    </div>
  );
};

export default MerchPage;

