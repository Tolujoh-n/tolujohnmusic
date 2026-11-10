import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema(
  {
    spotify: { type: String, trim: true, default: '' },
    appleMusic: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    youtube: { type: String, trim: true, default: '' },
    facebook: { type: String, trim: true, default: '' },
    x: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const copyBlockSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const pageContentSchema = new mongoose.Schema(
  {
    music: { type: copyBlockSchema, default: () => ({}) },
    videos: { type: copyBlockSchema, default: () => ({}) },
    tour: { type: copyBlockSchema, default: () => ({}) },
    merch: { type: copyBlockSchema, default: () => ({}) },
    subscribe: { type: copyBlockSchema, default: () => ({}) },
    contact: { type: copyBlockSchema, default: () => ({}) },
  },
  { _id: false }
);

const sectionContentSchema = new mongoose.Schema(
  {
    music: { type: copyBlockSchema, default: () => ({}) },
    tour: { type: copyBlockSchema, default: () => ({}) },
    merch: { type: copyBlockSchema, default: () => ({}) },
    subscribe: { type: copyBlockSchema, default: () => ({}) },
  },
  { _id: false }
);

const contactInfoSchema = new mongoose.Schema(
  {
    bookingLabel: { type: String, trim: true, default: 'Bookings & Management' },
    bookingEmail: { type: String, trim: true, default: '' },
    pressLabel: { type: String, trim: true, default: 'Press & Media' },
    pressEmail: { type: String, trim: true, default: '' },
    representationLabel: { type: String, trim: true, default: 'Representation' },
    representationName: { type: String, trim: true, default: '' },
    representationLocations: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      trim: true,
      default: 'Tolu John',
    },
    brandTagline: {
      type: String,
      trim: true,
      default: 'Music Artist',
    },
    brandLogo: {
      type: String,
      trim: true,
      default: '',
    },
    siteTitle: {
      type: String,
      trim: true,
      default: 'Tolu John | Official Music Platform',
    },
    siteDescription: {
      type: String,
      trim: true,
      default:
        'Official website of Tolu John — stream music, watch videos, get tour dates, shop merch, and join the inner circle.',
    },
    siteKeywords: {
      type: String,
      trim: true,
      default:
        'Tolu John, gospel artist, worship music, Nigerian gospel, tour dates, Christian music, merch',
    },
    ogImage: {
      type: String,
      trim: true,
      default: '',
    },
    siteUrl: {
      type: String,
      trim: true,
      default: 'https://tolujohn.com',
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    pageContent: {
      type: pageContentSchema,
      default: () => ({}),
    },
    sectionContent: {
      type: sectionContentSchema,
      default: () => ({}),
    },
    contactInfo: {
      type: contactInfoSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
