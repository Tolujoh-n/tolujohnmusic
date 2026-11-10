export interface PlatformLink {
  name: string;
  url: string;
}

export interface HeroHighlight {
  _id: string;
  songTitle: string;
  tagline: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl: string;
  backgroundImage?: string;
  releaseDate?: string;
  audioPreviewUrl?: string;
  freeDownloadEnabled?: boolean;
  freeDownloadUrl?: string;
  platforms?: PlatformLink[];
  updatedAt: string;
}

export interface AboutContent {
  _id: string;
  heading: string;
  subheading?: string;
  content: string;
  achievements?: { label: string; value: string }[];
  featuredImage?: string;
  imageOverlayLabel?: string;
  imageOverlayTitle?: string;
  quote?: {
    text?: string;
    attribution?: string;
  };
  updatedAt: string;
}

export interface TourDate {
  _id: string;
  title: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  isTicketed?: boolean;
  ticketUrl?: string;
  vipUrl?: string;
  isSoldOut: boolean;
}

export interface Video {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  releaseDate?: string;
  isFeatured?: boolean;
}

export interface Track {
  _id: string;
  title: string;
  description?: string;
  coverImage?: string;
  audioUrl?: string;
  releaseDate?: string;
  isFeatured?: boolean;
  platforms?: PlatformLink[];
  genres?: string[];
}

export type CurrencyCode = 'USD' | 'NGN';
export type MerchCtaType = 'link' | 'form';
export type MerchOrderStatus = 'new' | 'in-progress' | 'fulfilled' | 'cancelled';

export interface MerchItem {
  _id: string;
  title: string;
  description?: string;
  price: number;
  priceUsd?: number;
  priceNgn?: number;
  defaultCurrency?: CurrencyCode;
  imageUrl?: string;
  ctaType?: MerchCtaType;
  productUrl?: string;
  inStock: boolean;
  tags?: string[];
}

export interface MerchOrder {
  _id: string;
  merchItem?: string | { _id: string; title?: string; imageUrl?: string };
  itemTitle: string;
  itemPrice?: number;
  currency: CurrencyCode;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  notes?: string;
  status: MerchOrderStatus;
  createdAt: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  source?: string;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'in-progress' | 'resolved';
  createdAt: string;
}

export type SocialPlatform =
  | 'spotify'
  | 'appleMusic'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'x';

export type SocialLinks = Record<SocialPlatform, string>;

export interface CopyBlock {
  eyebrow: string;
  title: string;
  description: string;
}

export type PageContentKey = 'music' | 'videos' | 'tour' | 'merch' | 'subscribe' | 'contact';
export type SectionContentKey = 'music' | 'tour' | 'merch' | 'subscribe';

export interface ContactInfo {
  bookingLabel: string;
  bookingEmail: string;
  pressLabel: string;
  pressEmail: string;
  representationLabel: string;
  representationName: string;
  representationLocations: string;
}

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  brandLogo: string;
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  ogImage: string;
  siteUrl: string;
  socialLinks: SocialLinks;
  pageContent: Record<PageContentKey, CopyBlock>;
  sectionContent: Record<SectionContentKey, CopyBlock>;
  contactInfo: ContactInfo;
  updatedAt?: string;
}

export interface HomePayload {
  hero?: HeroHighlight;
  about?: AboutContent;
  tourDates: TourDate[];
  latestVideo?: Video;
  music: Track[];
  merch: MerchItem[];
  socialLinks?: SocialLinks;
  siteSettings?: SiteSettings;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

