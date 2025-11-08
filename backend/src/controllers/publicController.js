import { validationResult } from 'express-validator';
import HeroHighlight from '../models/HeroHighlight.js';
import About from '../models/About.js';
import TourDate from '../models/TourDate.js';
import Video from '../models/Video.js';
import Track from '../models/Track.js';
import MerchItem from '../models/MerchItem.js';
import Subscriber from '../models/Subscriber.js';
import ContactMessage from '../models/ContactMessage.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getHomeContent = asyncHandler(async (req, res) => {
  const [hero, about, tourDates, featuredVideo, featuredTracks, merch] =
    await Promise.all([
      HeroHighlight.findOne().sort({ updatedAt: -1 }),
      About.findOne().sort({ updatedAt: -1 }),
      TourDate.find({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .limit(6),
      Video.findOne({ isFeatured: true }).sort({ releaseDate: -1 }),
      Track.find({ isFeatured: true }).sort({ releaseDate: -1 }).limit(6),
      MerchItem.find().sort({ createdAt: -1 }).limit(4),
    ]);

  const fallbackVideo =
    featuredVideo || (await Video.findOne().sort({ releaseDate: -1 }));
  const fallbackTracks =
    featuredTracks.length > 0
      ? featuredTracks
      : await Track.find().sort({ releaseDate: -1 }).limit(6);

  res.json({
    success: true,
    data: {
      hero,
      about,
      tourDates,
      latestVideo: fallbackVideo,
      music: fallbackTracks,
      merch,
    },
  });
});

export const getMusic = asyncHandler(async (req, res) => {
  const tracks = await Track.find().sort({ releaseDate: -1 });
  res.json({ success: true, data: tracks });
});

export const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ releaseDate: -1 });
  res.json({ success: true, data: videos });
});

export const getTourDates = asyncHandler(async (req, res) => {
  const { includePast } = req.query;
  const now = new Date();
  const query = includePast ? {} : { date: { $gte: now } };
  const tours = await TourDate.find(query).sort({ date: 1 });
  res.json({ success: true, data: tours });
});

export const getMerch = asyncHandler(async (req, res) => {
  const merch = await MerchItem.find().sort({ createdAt: -1 });
  res.json({ success: true, data: merch });
});

export const subscribe = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Validation error', errors.array()));
  }

  const { email } = req.body;
  const existing = await Subscriber.findOne({ email });

  if (existing) {
    return res.status(200).json({
      success: true,
      message: 'You are already subscribed. Thank you!',
    });
  }

  await Subscriber.create({ email, source: 'website' });

  res.status(201).json({
    success: true,
    message: 'Thank you for subscribing!',
  });
});

export const submitContactMessage = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Validation error', errors.array()));
  }

  const { name, email, message } = req.body;

  await ContactMessage.create({ name, email, message });

  res.status(201).json({
    success: true,
    message:
      'Thank you for reaching out. A member of the team will be in touch soon.',
  });
});

