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

export interface MerchItem {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  productUrl: string;
  inStock: boolean;
  tags?: string[];
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

export interface HomePayload {
  hero?: HeroHighlight;
  about?: AboutContent;
  tourDates: TourDate[];
  latestVideo?: Video;
  music: Track[];
  merch: MerchItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

