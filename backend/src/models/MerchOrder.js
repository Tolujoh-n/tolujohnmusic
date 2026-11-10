import mongoose from 'mongoose';

const merchOrderSchema = new mongoose.Schema(
  {
    merchItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MerchItem',
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
      trim: true,
    },
    itemPrice: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      enum: ['USD', 'NGN'],
      default: 'USD',
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'fulfilled', 'cancelled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

const MerchOrder = mongoose.model('MerchOrder', merchOrderSchema);

export default MerchOrder;
