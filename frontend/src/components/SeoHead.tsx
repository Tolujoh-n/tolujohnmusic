import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import {
  defaultBrandLogo,
  defaultBrandName,
  defaultSiteDescription,
  defaultSiteKeywords,
  defaultSiteTitle,
  defaultSiteUrl,
  getPageCopy,
} from '../lib/siteContent';

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  if (!content) return;
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string, attrs: Record<string, string> = {}) => {
  if (!href) return;
  const selector = Object.entries(attrs).reduce(
    (acc, [key, value]) => `${acc}[${key}="${value}"]`,
    `link[rel="${rel}"]`
  );
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const upsertJsonLd = (id: string, data: Record<string, unknown>) => {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const pageTitleMap: Record<string, string> = {
  '/': '',
  '/about': 'About',
  '/music': 'Music',
  '/videos': 'Videos',
  '/tour': 'Tour',
  '/merch': 'Merch',
  '/subscribe': 'Subscribe',
  '/contact': 'Contact',
};

const SeoHead = () => {
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.title = 'Admin | Tolu John';
      return;
    }

    const brandName = settings?.brandName || defaultBrandName;
    const siteTitle = settings?.siteTitle || defaultSiteTitle;
    const siteDescription = settings?.siteDescription || defaultSiteDescription;
    const siteKeywords = settings?.siteKeywords || defaultSiteKeywords;
    const siteUrl = (settings?.siteUrl || defaultSiteUrl).replace(/\/$/, '');
    const brandLogo = settings?.brandLogo || defaultBrandLogo;
    const shareImage = settings?.ogImage || brandLogo || `${siteUrl}/logo512.png`;
    const absoluteShareImage = shareImage.startsWith('http')
      ? shareImage
      : `${siteUrl}${shareImage.startsWith('/') ? '' : '/'}${shareImage}`;

    const pathKey = location.pathname.replace(/\/$/, '') || '/';
    const pageKey = pathKey.replace(/^\//, '') as
      | 'music'
      | 'videos'
      | 'tour'
      | 'merch'
      | 'subscribe'
      | 'contact'
      | 'about'
      | '';

    let pageLabel = pageTitleMap[pathKey] || '';
    let pageDescription = siteDescription;

    if (pageKey && pageKey !== 'about' && settings?.pageContent?.[pageKey as 'music']) {
      const copy = getPageCopy(settings, pageKey as 'music');
      pageLabel = copy.title || pageLabel;
      pageDescription = copy.description || pageDescription;
    }

    const fullTitle = pageLabel ? `${pageLabel} | ${brandName}` : siteTitle;
    const canonical = `${siteUrl}${pathKey === '/' ? '/' : pathKey}`;

    document.title = fullTitle;
    upsertMeta('name', 'description', pageDescription);
    upsertMeta('name', 'keywords', siteKeywords);
    upsertMeta('name', 'author', brandName);
    upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    upsertMeta('name', 'theme-color', '#020617');

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', brandName);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', pageDescription);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', absoluteShareImage);
    upsertMeta('property', 'og:image:alt', `${brandName} logo`);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', pageDescription);
    upsertMeta('name', 'twitter:image', absoluteShareImage);

    upsertLink('canonical', canonical);
    upsertLink('icon', brandLogo, { sizes: 'any' });
    upsertLink('icon', brandLogo, { type: 'image/png' });
    upsertLink('apple-touch-icon', brandLogo);
    upsertLink('shortcut icon', brandLogo);

    upsertJsonLd('tolujohn-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'MusicGroup',
      name: brandName,
      url: siteUrl,
      description: siteDescription,
      image: absoluteShareImage,
      genre: ['Gospel', 'Worship'],
    });
  }, [location.pathname, settings]);

  return null;
};

export default SeoHead;
