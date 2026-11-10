import { useState } from 'react';
import type { CurrencyCode, MerchItem } from '../types/content';
import MerchCard from '../components/MerchCard';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getSectionCopy } from '../lib/siteContent';
import PageIntro from '../components/PageIntro';

interface MerchSpotlightSectionProps {
  items: MerchItem[];
}

const MerchSpotlightSection = ({ items }: MerchSpotlightSectionProps) => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const { data: siteSettings } = useSiteSettings();
  const copy = getSectionCopy(siteSettings, 'merch');

  if (items.length === 0) return null;

  return (
    <section id="merch" className="border-t border-white/5 bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <PageIntro copy={copy} as="h2" className="max-w-xl" />
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex rounded-full border border-white/15 p-1">
              {(['USD', 'NGN'] as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={[
                    'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition',
                    currency === code
                      ? 'bg-accent-500 text-slate-950'
                      : 'text-slate-300 hover:text-white',
                  ].join(' ')}
                >
                  {code}
                </button>
              ))}
            </div>
            <a
              href="/merch"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:border-accent-400 hover:text-accent-200"
            >
              View Store
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MerchCard key={item._id} item={item} preferredCurrency={currency} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchSpotlightSection;
