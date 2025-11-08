import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    audioUrl: {
      type: String,
    },
    releaseDate: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    platforms: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    mood: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

trackSchema.index({ releaseDate: -1 });
trackSchema.index({ isFeatured: 1 });

const Track = mongoose.model('Track', trackSchema);

export default Track;

