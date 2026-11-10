import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminAPI } from '../../lib/api';
import type {
  ContactInfo,
  CopyBlock,
  PageContentKey,
  SectionContentKey,
  SiteSettings,
} from '../../types/content';
import {
  defaultBrandName,
  defaultBrandTagline,
  defaultContactInfo,
  defaultPageContent,
  defaultSectionContent,
  defaultSiteDescription,
  defaultSiteKeywords,
  defaultSiteTitle,
  defaultSiteUrl,
} from '../../lib/siteContent';
import ImageUploadField from '../../components/ImageUploadField';

const pageLabels: Record<PageContentKey, string> = {
  music: 'Music Page',
  videos: 'Videos Page',
  tour: 'Tour Page',
  merch: 'Merch Page',
  subscribe: 'Subscribe Page',
  contact: 'Contact Page',
};

const sectionLabels: Record<SectionContentKey, string> = {
  music: 'Home · Music Section',
  tour: 'Home · Tour Section',
  merch: 'Home · Merch Section',
  subscribe: 'Home · Subscribe Section',
};

const emptyCopy = (): CopyBlock => ({ eyebrow: '', title: '', description: '' });

const AdminSiteContentPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: AdminAPI.getSiteSettings,
  });

  const [brandName, setBrandName] = useState(defaultBrandName);
  const [brandTagline, setBrandTagline] = useState(defaultBrandTagline);
  const [brandLogo, setBrandLogo] = useState('');
  const [siteTitle, setSiteTitle] = useState(defaultSiteTitle);
  const [siteDescription, setSiteDescription] = useState(defaultSiteDescription);
  const [siteKeywords, setSiteKeywords] = useState(defaultSiteKeywords);
  const [ogImage, setOgImage] = useState('');
  const [siteUrl, setSiteUrl] = useState(defaultSiteUrl);
  const [pageContent, setPageContent] =
    useState<SiteSettings['pageContent']>(defaultPageContent);
  const [sectionContent, setSectionContent] =
    useState<SiteSettings['sectionContent']>(defaultSectionContent);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  useEffect(() => {
    if (!data) return;
    setBrandName(data.brandName || defaultBrandName);
    setBrandTagline(data.brandTagline || defaultBrandTagline);
    setBrandLogo(data.brandLogo || '');
    setSiteTitle(data.siteTitle || defaultSiteTitle);
    setSiteDescription(data.siteDescription || defaultSiteDescription);
    setSiteKeywords(data.siteKeywords || defaultSiteKeywords);
    setOgImage(data.ogImage || '');
    setSiteUrl(data.siteUrl || defaultSiteUrl);
    setPageContent({ ...defaultPageContent, ...data.pageContent });
    setSectionContent({ ...defaultSectionContent, ...data.sectionContent });
    setContactInfo({ ...defaultContactInfo, ...data.contactInfo });
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      AdminAPI.saveSiteSettings({
        brandName,
        brandTagline,
        brandLogo,
        siteTitle,
        siteDescription,
        siteKeywords,
        ogImage,
        siteUrl,
        pageContent,
        sectionContent,
        contactInfo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
  });

  const updatePageBlock = (key: PageContentKey, field: keyof CopyBlock, value: string) => {
    setPageContent((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || emptyCopy()), [field]: value },
    }));
  };

  const updateSectionBlock = (key: SectionContentKey, field: keyof CopyBlock, value: string) => {
    setSectionContent((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || emptyCopy()), [field]: value },
    }));
  };

  if (isLoading && !data) {
    return <div className="h-48 animate-pulse rounded-3xl bg-white/5" />;
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-accent-300">Site Content</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold uppercase tracking-[0.3em] text-white">
          Page & Section Copy
        </h1>
        <p className="mt-3 text-sm text-slate-300">
          Control headlines and descriptions across the public site. Replace any leftover template
          wording with Tolu John&apos;s real messaging.
        </p>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
        className="space-y-8"
      >
        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated">
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">
              Brand, Logo & SEO
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Navbar logo is also used as the favicon/search icon. SEO fields help Google and social
              previews show the right title, description, and image.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="Tolu John"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Header Tagline
              </label>
              <input
                type="text"
                value={brandTagline}
                onChange={(event) => setBrandTagline(event.target.value)}
                placeholder="Music Artist"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
          </div>

          <ImageUploadField
            label="Navbar / Favicon Logo"
            value={brandLogo}
            onChange={setBrandLogo}
            helperText="Upload a square logo (PNG/SVG preferred). This powers the navbar and browser/search favicon."
          />

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Site Title (Search Result Title)
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(event) => setSiteTitle(event.target.value)}
              placeholder="Tolu John | Official Music Platform"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={siteDescription}
              onChange={(event) => setSiteDescription(event.target.value)}
              placeholder="Short description for Google and social shares"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
            <p className="mt-2 text-xs text-slate-500">
              Aim for about 140–160 characters for best search snippets.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Keywords
            </label>
            <input
              type="text"
              value={siteKeywords}
              onChange={(event) => setSiteKeywords(event.target.value)}
              placeholder="Tolu John, gospel, worship, tour..."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
              Canonical Site URL
            </label>
            <input
              type="url"
              value={siteUrl}
              onChange={(event) => setSiteUrl(event.target.value)}
              placeholder="https://tolujohn.com"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
            />
          </div>

          <ImageUploadField
            label="Social Share Image (optional)"
            value={ogImage}
            onChange={setOgImage}
            helperText="Used for Facebook/X/WhatsApp previews. If empty, the logo is used."
          />
        </section>

        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated">
          <div>
            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">Contact Details</h2>
            <p className="mt-2 text-sm text-slate-300">
              Controls the contact page sidebar. Leave an email or representation value blank to hide
              that block.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-300">Bookings block</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Label
                </label>
                <input
                  type="text"
                  value={contactInfo.bookingLabel}
                  onChange={(event) =>
                    setContactInfo((prev) => ({ ...prev, bookingLabel: event.target.value }))
                  }
                  placeholder="Bookings & Management"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={contactInfo.bookingEmail}
                  onChange={(event) =>
                    setContactInfo((prev) => ({ ...prev, bookingEmail: event.target.value }))
                  }
                  placeholder="booking@example.com"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-300">Press block</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Label
                </label>
                <input
                  type="text"
                  value={contactInfo.pressLabel}
                  onChange={(event) =>
                    setContactInfo((prev) => ({ ...prev, pressLabel: event.target.value }))
                  }
                  placeholder="Press & Media"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={contactInfo.pressEmail}
                  onChange={(event) =>
                    setContactInfo((prev) => ({ ...prev, pressEmail: event.target.value }))
                  }
                  placeholder="press@example.com"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-300">Representation block</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Label
                </label>
                <input
                  type="text"
                  value={contactInfo.representationLabel}
                  onChange={(event) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      representationLabel: event.target.value,
                    }))
                  }
                  placeholder="Representation"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Name / Agency
                </label>
                <input
                  type="text"
                  value={contactInfo.representationName}
                  onChange={(event) =>
                    setContactInfo((prev) => ({ ...prev, representationName: event.target.value }))
                  }
                  placeholder="Your management / agency name"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Locations
                </label>
                <input
                  type="text"
                  value={contactInfo.representationLocations}
                  onChange={(event) =>
                    setContactInfo((prev) => ({
                      ...prev,
                      representationLocations: event.target.value,
                    }))
                  }
                  placeholder="Lagos · London"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Contact page preview</p>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              {contactInfo.bookingEmail ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    {contactInfo.bookingLabel || 'Bookings & Management'}
                  </p>
                  <p className="mt-1 text-base text-white">{contactInfo.bookingEmail}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Bookings block hidden (no email set)</p>
              )}
              {contactInfo.pressEmail ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    {contactInfo.pressLabel || 'Press & Media'}
                  </p>
                  <p className="mt-1 text-base text-white">{contactInfo.pressEmail}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Press block hidden (no email set)</p>
              )}
              {contactInfo.representationName || contactInfo.representationLocations ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    {contactInfo.representationLabel || 'Representation'}
                  </p>
                  {contactInfo.representationName && (
                    <p className="mt-1 text-base text-white">{contactInfo.representationName}</p>
                  )}
                  {contactInfo.representationLocations && (
                    <p className="text-sm text-slate-400">{contactInfo.representationLocations}</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Representation block hidden</p>
              )}
            </div>
          </div>
        </section>

        {(Object.keys(pageLabels) as PageContentKey[]).map((key) => (
          <section
            key={key}
            className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">{pageLabels[key]}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={pageContent[key]?.eyebrow || ''}
                  onChange={(event) => updatePageBlock(key, 'eyebrow', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Title</label>
                <input
                  type="text"
                  value={pageContent[key]?.title || ''}
                  onChange={(event) => updatePageBlock(key, 'title', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Description
              </label>
              <textarea
                rows={3}
                value={pageContent[key]?.description || ''}
                onChange={(event) => updatePageBlock(key, 'description', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
          </section>
        ))}

        {(Object.keys(sectionLabels) as SectionContentKey[]).map((key) => (
          <section
            key={key}
            className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-elevated"
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-400">{sectionLabels[key]}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={sectionContent[key]?.eyebrow || ''}
                  onChange={(event) => updateSectionBlock(key, 'eyebrow', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">Title</label>
                <input
                  type="text"
                  value={sectionContent[key]?.title || ''}
                  onChange={(event) => updateSectionBlock(key, 'title', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-slate-400">
                Description
              </label>
              <textarea
                rows={3}
                value={sectionContent[key]?.description || ''}
                onChange={(event) => updateSectionBlock(key, 'description', event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
              />
            </div>
          </section>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          {mutation.isSuccess && (
            <p className="text-sm font-semibold text-accent-200">Site content saved.</p>
          )}
          {mutation.isError && (
            <p className="text-sm text-red-300">
              {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data
                ?.message ||
                (mutation.error instanceof Error
                  ? mutation.error.message
                  : 'Unable to save site content.')}
            </p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {mutation.isPending ? 'Saving...' : 'Save Site Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSiteContentPage;
