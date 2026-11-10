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
    isTicketed: {
      type: Boolean,
      default: true,
    },
    ticketUrl: {
      type: String,
      trim: true,
      default: '',
    },
    vipUrl: {
      type: String,
      trim: true,
      default: '',
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
