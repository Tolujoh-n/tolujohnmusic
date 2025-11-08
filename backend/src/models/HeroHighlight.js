import mongoose from 'mongoose';

const heroHighlightSchema = new mongoose.Schema(
  {
    songTitle: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    ctaLabel: {
      type: String,
      default: 'Listen Now',
    },
    ctaUrl: {
      type: String,
      required: true,
      trim: true,
    },
    backgroundImage: {
      type: String,
    },
    releaseDate: {
      type: Date,
    },
    audioPreviewUrl: {
      type: String,
    },
    platforms: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const HeroHighlight = mongoose.model('HeroHighlight', heroHighlightSchema);

export default HeroHighlight;

