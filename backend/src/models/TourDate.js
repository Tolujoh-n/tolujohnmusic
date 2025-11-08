import mongoose from 'mongoose';

const tourDateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    ticketUrl: {
      type: String,
    },
    vipUrl: {
      type: String,
    },
    isSoldOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

tourDateSchema.index({ date: 1 });

const TourDate = mongoose.model('TourDate', tourDateSchema);

export default TourDate;

