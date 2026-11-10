import type { CurrencyCode, MerchItem } from '../types/content';

export const formatMoney = (amount: number, currency: CurrencyCode) => {
  if (currency === 'NGN') {
    return `₦${amount.toLocaleString('en-NG', {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const resolveMerchPrice = (item: MerchItem, currency: CurrencyCode) => {
  if (currency === 'NGN') {
    if (typeof item.priceNgn === 'number') return item.priceNgn;
    if (item.defaultCurrency === 'NGN' && typeof item.price === 'number') return item.price;
    return null;
  }

  if (typeof item.priceUsd === 'number') return item.priceUsd;
  if (item.defaultCurrency !== 'NGN' && typeof item.price === 'number') return item.price;
  return null;
};

export const getAvailableCurrencies = (item: MerchItem): CurrencyCode[] => {
  const currencies: CurrencyCode[] = [];
  if (resolveMerchPrice(item, 'USD') !== null) currencies.push('USD');
  if (resolveMerchPrice(item, 'NGN') !== null) currencies.push('NGN');
  return currencies.length > 0 ? currencies : ['USD'];
};

export const pickDisplayCurrency = (
  item: MerchItem,
  preferred: CurrencyCode
): CurrencyCode => {
  const available = getAvailableCurrencies(item);
  if (available.includes(preferred)) return preferred;
  if (item.defaultCurrency && available.includes(item.defaultCurrency)) {
    return item.defaultCurrency;
  }
  return available[0];
};
