export const emptySocialLinks = {
  spotify: '',
  appleMusic: '',
  instagram: '',
  youtube: '',
  facebook: '',
  x: '',
};

export const defaultPageContent = {
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

export const defaultSectionContent = {
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

export const defaultContactInfo = {
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

const copyKeys = ['eyebrow', 'title', 'description'];

export const normalizeCopyBlock = (input = {}, fallback = {}) => {
  const next = {};
  copyKeys.forEach((key) => {
    const value = input?.[key];
    if (typeof value === 'string' && value.trim()) {
      next[key] = value.trim();
    } else if (typeof fallback[key] === 'string') {
      next[key] = fallback[key];
    } else {
      next[key] = '';
    }
  });
  return next;
};

export const normalizeCopyMap = (input = {}, defaults = {}) => {
  const next = {};
  Object.keys(defaults).forEach((key) => {
    next[key] = normalizeCopyBlock(input?.[key], defaults[key]);
  });
  return next;
};

export const mergeCopyMapUpdate = (current = {}, incoming = {}, defaults = {}) => {
  const next = { ...current };
  Object.keys(defaults).forEach((key) => {
    if (incoming?.[key] && typeof incoming[key] === 'object') {
      next[key] = normalizeCopyBlock(
        {
          ...(current?.[key] || {}),
          ...incoming[key],
        },
        defaults[key]
      );
    } else if (!next[key]) {
      next[key] = { ...defaults[key] };
    }
  });
  return next;
};

export const normalizeSocialLinks = (input = {}) => {
  const next = { ...emptySocialLinks };
  Object.keys(emptySocialLinks).forEach((key) => {
    const value = input?.[key];
    next[key] = typeof value === 'string' ? value.trim() : '';
  });
  return next;
};

const pickContactString = (input, key, fallback = '') => {
  if (typeof input?.[key] === 'string') {
    return input[key].trim();
  }
  return fallback;
};

export const normalizeContactInfo = (input = {}, useDefaults = true) => {
  const labelOrDefault = (key, fallbackLabel) => {
    const value = pickContactString(input, key);
    if (value) return value;
    return useDefaults ? fallbackLabel : '';
  };

  return {
    bookingLabel: labelOrDefault('bookingLabel', defaultContactInfo.bookingLabel),
    bookingEmail: pickContactString(input, 'bookingEmail'),
    pressLabel: labelOrDefault('pressLabel', defaultContactInfo.pressLabel),
    pressEmail: pickContactString(input, 'pressEmail'),
    representationLabel: labelOrDefault(
      'representationLabel',
      defaultContactInfo.representationLabel
    ),
    representationName: pickContactString(input, 'representationName'),
    representationLocations: pickContactString(input, 'representationLocations'),
  };
};

const pickTrimmed = (value, fallback = '') => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return fallback;
};

export const serializeSiteSettings = (settings) => {
  const raw = settings?.toObject?.() || settings || {};
  return {
    brandName: pickTrimmed(raw.brandName, defaultBrandName),
    brandTagline: pickTrimmed(raw.brandTagline, defaultBrandTagline),
    brandLogo: pickTrimmed(raw.brandLogo, ''),
    siteTitle: pickTrimmed(raw.siteTitle, defaultSiteTitle),
    siteDescription: pickTrimmed(raw.siteDescription, defaultSiteDescription),
    siteKeywords: pickTrimmed(raw.siteKeywords, defaultSiteKeywords),
    ogImage: pickTrimmed(raw.ogImage, ''),
    siteUrl: pickTrimmed(raw.siteUrl, defaultSiteUrl).replace(/\/$/, ''),
    socialLinks: normalizeSocialLinks(raw.socialLinks),
    pageContent: normalizeCopyMap(raw.pageContent, defaultPageContent),
    sectionContent: normalizeCopyMap(raw.sectionContent, defaultSectionContent),
    contactInfo: normalizeContactInfo(raw.contactInfo, true),
    updatedAt: raw.updatedAt,
  };
};
