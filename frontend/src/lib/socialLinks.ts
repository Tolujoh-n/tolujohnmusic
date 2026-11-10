import type { ComponentType } from 'react';
import { FaSpotify, FaInstagram, FaYoutube, FaApple, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import type { SocialLinks, SocialPlatform } from '../types/content';

type SocialIcon = ComponentType<{ className?: string; title?: string }>;

export const SOCIAL_PLATFORM_META: Record<
  SocialPlatform,
  { label: string; placeholder: string; Icon: SocialIcon }
> = {
  spotify: {
    label: 'Spotify',
    placeholder: 'https://open.spotify.com/artist/...',
    Icon: FaSpotify,
  },
  appleMusic: {
    label: 'Apple Music',
    placeholder: 'https://music.apple.com/...',
    Icon: FaApple,
  },
  instagram: {
    label: 'Instagram',
    placeholder: 'https://instagram.com/...',
    Icon: FaInstagram,
  },
  youtube: {
    label: 'YouTube',
    placeholder: 'https://youtube.com/@...',
    Icon: FaYoutube,
  },
  facebook: {
    label: 'Facebook',
    placeholder: 'https://facebook.com/...',
    Icon: FaFacebook,
  },
  x: {
    label: 'X (Twitter)',
    placeholder: 'https://x.com/...',
    Icon: FaXTwitter,
  },
};

export const SOCIAL_PLATFORM_ORDER: SocialPlatform[] = [
  'spotify',
  'appleMusic',
  'instagram',
  'youtube',
  'facebook',
  'x',
];

export const emptySocialLinks = (): SocialLinks => ({
  spotify: '',
  appleMusic: '',
  instagram: '',
  youtube: '',
  facebook: '',
  x: '',
});

export const getActiveSocialLinks = (links?: SocialLinks | null) =>
  SOCIAL_PLATFORM_ORDER.filter((key) => Boolean(links?.[key]?.trim())).map((key) => ({
    key,
    url: links![key]!.trim(),
    ...SOCIAL_PLATFORM_META[key],
  }));
