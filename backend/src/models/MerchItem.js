import mongoose from 'mongoose';

const merchItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    // Legacy single price — kept for backward compatibility with existing records
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    priceUsd: {
      type: Number,
      min: 0,
    },
    priceNgn: {
      type: Number,
      min: 0,
    },
    defaultCurrency: {
      type: String,
      enum: ['USD', 'NGN'],
      default: 'USD',
    },
    imageUrl: {
      type: String,
    },
    ctaType: {
      type: String,
      enum: ['link', 'form'],
      default: 'link',
    },
    productUrl: {
      type: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const MerchItem = mongoose.model('MerchItem', merchItemSchema);

export default MerchItem;
