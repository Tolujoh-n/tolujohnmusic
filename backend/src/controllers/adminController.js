import { validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import HeroHighlight from '../models/HeroHighlight.js';
import About from '../models/About.js';
import Track from '../models/Track.js';
import Video from '../models/Video.js';
import TourDate from '../models/TourDate.js';
import MerchItem from '../models/MerchItem.js';
import Subscriber from '../models/Subscriber.js';
import ContactMessage from '../models/ContactMessage.js';

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation error', errors.array());
  }
};

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [tracks, videos, upcomingTours, subscribers, messages] = await Promise.all([
    Track.countDocuments(),
    Video.countDocuments(),
    TourDate.countDocuments({ date: { $gte: new Date() } }),
    Subscriber.countDocuments(),
    ContactMessage.countDocuments({ status: 'new' }),
  ]);

  res.json({
    success: true,
    data: {
      tracks,
      videos,
      upcomingTours,
      subscribers,
      newMessages: messages,
    },
  });
});

export const getHeroHighlight = asyncHandler(async (req, res) => {
  const hero = await HeroHighlight.findOne().sort({ updatedAt: -1 });
  res.json({ success: true, data: hero });
});

export const upsertHeroHighlight = asyncHandler(async (req, res) => {
  handleValidation(req);
  const payload = req.body;

  const hero = await HeroHighlight.findOne();
  if (hero) {
    hero.set(payload);
    await hero.save();
    return res.json({ success: true, data: hero });
  }

  const created = await HeroHighlight.create(payload);
  return res.status(201).json({ success: true, data: created });
});

export const getAboutContent = asyncHandler(async (req, res) => {
  const about = await About.findOne().sort({ updatedAt: -1 });
  res.json({ success: true, data: about });
});

export const upsertAboutContent = asyncHandler(async (req, res) => {
  handleValidation(req);
  const payload = req.body;
  const about = await About.findOne();

  if (about) {
    about.set(payload);
    await about.save();
    return res.json({ success: true, data: about });
  }

  const created = await About.create(payload);
  return res.status(201).json({ success: true, data: created });
});

export const listTracks = asyncHandler(async (req, res) => {
  const tracks = await Track.find().sort({ releaseDate: -1 });
  res.json({ success: true, data: tracks });
});

export const createTrack = asyncHandler(async (req, res) => {
  handleValidation(req);
  const track = await Track.create(req.body);
  res.status(201).json({ success: true, data: track });
});

export const updateTrack = asyncHandler(async (req, res, next) => {
  handleValidation(req);
  const { id } = req.params;
  const track = await Track.findById(id);
  if (!track) {
    return next(new ApiError(404, 'Track not found'));
  }
  track.set(req.body);
  await track.save();
  res.json({ success: true, data: track });
});

export const deleteTrack = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const track = await Track.findById(id);
  if (!track) {
    return next(new ApiError(404, 'Track not found'));
  }
  await track.deleteOne();
  res.status(204).send();
});

export const listVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ releaseDate: -1 });
  res.json({ success: true, data: videos });
});

export const createVideo = asyncHandler(async (req, res) => {
  handleValidation(req);
  const video = await Video.create(req.body);
  res.status(201).json({ success: true, data: video });
});

export const updateVideo = asyncHandler(async (req, res, next) => {
  handleValidation(req);
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return next(new ApiError(404, 'Video not found'));
  }
  video.set(req.body);
  await video.save();
  res.json({ success: true, data: video });
});

export const deleteVideo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return next(new ApiError(404, 'Video not found'));
  }
  await video.deleteOne();
  res.status(204).send();
});

export const listTours = asyncHandler(async (req, res) => {
  const tours = await TourDate.find().sort({ date: 1 });
  res.json({ success: true, data: tours });
});

export const createTour = asyncHandler(async (req, res) => {
  handleValidation(req);
  const tour = await TourDate.create(req.body);
  res.status(201).json({ success: true, data: tour });
});

export const updateTour = asyncHandler(async (req, res, next) => {
  handleValidation(req);
  const { id } = req.params;
  const tour = await TourDate.findById(id);
  if (!tour) {
    return next(new ApiError(404, 'Tour date not found'));
  }
  tour.set(req.body);
  await tour.save();
  res.json({ success: true, data: tour });
});

export const deleteTour = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const tour = await TourDate.findById(id);
  if (!tour) {
    return next(new ApiError(404, 'Tour date not found'));
  }
  await tour.deleteOne();
  res.status(204).send();
});

export const listMerch = asyncHandler(async (req, res) => {
  const merch = await MerchItem.find().sort({ createdAt: -1 });
  res.json({ success: true, data: merch });
});

export const createMerch = asyncHandler(async (req, res) => {
  handleValidation(req);
  const item = await MerchItem.create(req.body);
  res.status(201).json({ success: true, data: item });
});

export const updateMerch = asyncHandler(async (req, res, next) => {
  handleValidation(req);
  const { id } = req.params;
  const item = await MerchItem.findById(id);
  if (!item) {
    return next(new ApiError(404, 'Merch item not found'));
  }
  item.set(req.body);
  await item.save();
  res.json({ success: true, data: item });
});

export const deleteMerch = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const item = await MerchItem.findById(id);
  if (!item) {
    return next(new ApiError(404, 'Merch item not found'));
  }
  await item.deleteOne();
  res.status(204).send();
});

export const listSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort({ createdAt: -1 });
  res.json({ success: true, data: subscribers });
});

export const listContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ success: true, data: messages });
});

export const updateContactStatus = asyncHandler(async (req, res, next) => {
  handleValidation(req);
  const { id } = req.params;
  const message = await ContactMessage.findById(id);
  if (!message) {
    return next(new ApiError(404, 'Message not found'));
  }
  message.status = req.body.status;
  await message.save();
  res.json({ success: true, data: message });
});

