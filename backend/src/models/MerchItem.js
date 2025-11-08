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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
    },
    productUrl: {
      type: String,
      required: true,
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

