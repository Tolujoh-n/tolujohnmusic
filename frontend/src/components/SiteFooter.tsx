import { useSiteSettings } from '../hooks/useSiteSettings';
import { defaultBrandLogo, defaultBrandName } from '../lib/siteContent';
import SocialLinks from './SocialLinks';

const SiteFooter = () => {
  const { data } = useSiteSettings();
  const brandName = data?.brandName || defaultBrandName;
  const brandLogo = data?.brandLogo || defaultBrandLogo;
  const socialLinks = data?.socialLinks;

  return (
    <footer className="border-t border-white/10 bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 md:flex-row md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <img src={brandLogo} alt={`${brandName} logo`} className="h-8 w-8 object-contain" />
            <h3 className="font-heading text-xl font-semibold uppercase tracking-[0.4em] text-white">
              {brandName}
            </h3>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">
            © {new Date().getFullYear()} {brandName} Music. All rights reserved.
          </p>
        </div>

        <SocialLinks
          links={socialLinks}
          showHeading
          className="mt-4 flex flex-wrap gap-4 text-xl text-slate-400"
        />
      </div>
    </footer>
  );
};

export default SiteFooter;
