import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PublicAPI } from '../lib/api';
import MerchCard from '../components/MerchCard';
import type { CurrencyCode } from '../types/content';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { getPageCopy } from '../lib/siteContent';
import PageIntro from '../components/PageIntro';

const MerchPage = () => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['merch'],
    queryFn: PublicAPI.getMerch,
  });
  const { data: siteSettings } = useSiteSettings();
  const copy = getPageCopy(siteSettings, 'merch');

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
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <PageIntro copy={copy} className="max-w-3xl" />

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
                {code === 'USD' ? 'Dollar ($)' : 'Naira (₦)'}
              </button>
            ))}
          </div>
        </header>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <MerchCard key={item._id} item={item} preferredCurrency={currency} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchPage;
