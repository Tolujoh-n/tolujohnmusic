import type { SocialLinks as SocialLinksType } from '../types/content';
import { getActiveSocialLinks } from '../lib/socialLinks';

interface SocialLinksProps {
  links?: SocialLinksType | null;
  className?: string;
  iconClassName?: string;
  label?: string;
  showHeading?: boolean;
}

const SocialLinks = ({
  links,
  className = 'mt-4 flex flex-wrap gap-4 text-xl text-slate-400',
  iconClassName = 'transition hover:text-white',
  label = 'Listen & Connect',
  showHeading = false,
}: SocialLinksProps) => {
  const active = getActiveSocialLinks(links);

  if (active.length === 0) {
    return null;
  }

  return (
    <div>
      {showHeading && (
        <h4 className="text-sm font-semibold uppercase tracking-[0.4em] text-white">{label}</h4>
      )}
      <div className={className}>
        {active.map(({ key, url, label: platformLabel, Icon }) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={platformLabel}
            title={platformLabel}
            className={iconClassName}
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
