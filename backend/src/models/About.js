import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    subheading: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    achievements: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    featuredImage: {
      type: String,
      trim: true,
    },
    imageOverlayLabel: {
      type: String,
      trim: true,
      default: '',
    },
    imageOverlayTitle: {
      type: String,
      trim: true,
      default: '',
    },
    quote: {
      text: { type: String },
      attribution: { type: String },
    },
  },
  { timestamps: true }
);

const About = mongoose.model('About', aboutSchema);

export default About;

