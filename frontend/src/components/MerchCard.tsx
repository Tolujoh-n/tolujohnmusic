import { useMemo, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import type { CurrencyCode, MerchItem } from '../types/content';
import {
  formatMoney,
  getAvailableCurrencies,
  pickDisplayCurrency,
  resolveMerchPrice,
} from '../lib/currency';
import MerchOrderModal from './MerchOrderModal';

interface MerchCardProps {
  item: MerchItem;
  preferredCurrency: CurrencyCode;
}

const MerchCard = ({ item, preferredCurrency }: MerchCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const available = useMemo(() => getAvailableCurrencies(item), [item]);
  const currency = pickDisplayCurrency(item, preferredCurrency);
  const price = resolveMerchPrice(item, currency);
  const ctaType = item.ctaType || 'link';

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-elevated transition hover:-translate-y-1 hover:border-accent-400/50">
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
          {item.description && (
            <p className="text-sm text-slate-300 line-clamp-3">{item.description}</p>
          )}

          {price !== null ? (
            <p className="text-lg font-bold text-accent-200">{formatMoney(price, currency)}</p>
          ) : (
            <p className="text-sm text-slate-400">Price available on request</p>
          )}

          {available.length > 1 && (
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Also available in {available.filter((code) => code !== currency).join(', ')}
            </p>
          )}

          <div className="mt-auto">
            {!item.inStock ? (
              <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Unavailable
              </span>
            ) : ctaType === 'form' ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:bg-accent-400"
              >
                Get it Now
              </button>
            ) : (
              <a
                href={item.productUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:bg-accent-400"
              >
                Get it Now
                <FaExternalLinkAlt className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </article>

      <MerchOrderModal
        item={item}
        currency={currency}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default MerchCard;
