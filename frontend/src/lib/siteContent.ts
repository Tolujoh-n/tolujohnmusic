import type {
  ContactInfo,
  CopyBlock,
  PageContentKey,
  SectionContentKey,
  SiteSettings,
} from '../types/content';

export const defaultPageContent: Record<PageContentKey, CopyBlock> = {
  music: {
    eyebrow: 'Music',
    title: 'Discography',
    description:
      'A curated body of work that captures a journey of faith, resilience, and vibrant African expressions of worship.',
  },
  videos: {
    eyebrow: 'Videos',
    title: 'Visual Storytelling',
    description:
      'Relive electric live moments and cinematic stories from the ministry and stage of Tolu John.',
  },
  tour: {
    eyebrow: 'Tour',
    title: 'Tour Schedule',
    description:
      'Experience unforgettable worship nights across continents. Secure your seat and invite your community.',
  },
  merch: {
    eyebrow: 'Merch',
    title: 'Official Collection',
    description:
      'Wear the movement. Every piece is crafted for those who believe music can shift atmospheres.',
  },
  subscribe: {
    eyebrow: 'Subscribe',
    title: 'Inner Circle Access',
    description:
      'Be the first to know about unreleased songs, exclusive merch drops, tour announcements, and behind-the-scenes moments.',
  },
  contact: {
    eyebrow: 'Contact',
    title: "Let's Create Moments",
    description:
      'For bookings, collaborations, media inquiries, or partnership opportunities, send a message and the team will respond promptly.',
  },
};

export const defaultSectionContent: Record<SectionContentKey, CopyBlock> = {
  music: {
    eyebrow: 'Discography',
    title: 'Music Catalogue',
    description:
      'Discover the evolving soundscape of Tolu John — from intimate worship ballads to stadium-ready anthems that stir the soul.',
  },
  tour: {
    eyebrow: 'On Tour',
    title: 'Upcoming Experiences',
    description:
      'Join Tolu John in immersive nights of worship across the globe. Secure your tickets early.',
  },
  merch: {
    eyebrow: 'Merch Drop',
    title: 'Official Merchandise',
    description: 'Premium pieces from the official collection. Designed for the devoted.',
  },
  subscribe: {
    eyebrow: 'Stay Connected',
    title: 'Join the Inner Circle',
    description:
      'Receive exclusive stories, tour announcements, and early access to new music from Tolu John.',
  },
};

export const defaultContactInfo: ContactInfo = {
  bookingLabel: 'Bookings & Management',
  bookingEmail: '',
  pressLabel: 'Press & Media',
  pressEmail: '',
  representationLabel: 'Representation',
  representationName: '',
  representationLocations: '',
};

export const defaultBrandName = 'Tolu John';
export const defaultBrandTagline = 'Music Artist';
export const defaultSiteTitle = 'Tolu John | Official Music Platform';
export const defaultSiteDescription =
  'Official website of Tolu John — stream music, watch videos, get tour dates, shop merch, and join the inner circle.';
export const defaultSiteKeywords =
  'Tolu John, gospel artist, worship music, Nigerian gospel, tour dates, Christian music, merch';
export const defaultSiteUrl = 'https://tolujohn.com';
export const defaultBrandLogo = '/brand-logo.png';

export const getPageCopy = (settings: SiteSettings | undefined, key: PageContentKey): CopyBlock =>
  settings?.pageContent?.[key] || defaultPageContent[key];

export const getSectionCopy = (
  settings: SiteSettings | undefined,
  key: SectionContentKey
): CopyBlock => settings?.sectionContent?.[key] || defaultSectionContent[key];

export const getContactInfo = (settings: SiteSettings | undefined): ContactInfo => ({
  ...defaultContactInfo,
  ...(settings?.contactInfo || {}),
});
