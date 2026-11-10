import { validationResult } from 'express-validator';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import HeroHighlight from '../models/HeroHighlight.js';
import About from '../models/About.js';
import Track from '../models/Track.js';
import Video from '../models/Video.js';
import TourDate from '../models/TourDate.js';
import MerchItem from '../models/MerchItem.js';
import MerchOrder from '../models/MerchOrder.js';
import Subscriber from '../models/Subscriber.js';
import ContactMessage from '../models/ContactMessage.js';

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, 'Validation error', errors.array());
  }
};

const parseOptionalPrice = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeMerchPayload = (body = {}, { isUpdate = false, existing = {} } = {}) => {
  const payload = { ...body };
  const hasUsdField = Object.prototype.hasOwnProperty.call(body, 'priceUsd');
  const hasNgnField = Object.prototype.hasOwnProperty.call(body, 'priceNgn');

  const incomingUsd = hasUsdField ? parseOptionalPrice(body.priceUsd) : undefined;
  const incomingNgn = hasNgnField ? parseOptionalPrice(body.priceNgn) : undefined;
  const legacyPrice = parseOptionalPrice(body.price ?? existing.price);

  const defaultCurrency =
    (body.defaultCurrency ?? existing.defaultCurrency) === 'NGN' ? 'NGN' : 'USD';

  let resolvedUsd = hasUsdField
    ? incomingUsd
    : existing.priceUsd !== undefined && existing.priceUsd !== null
      ? Number(existing.priceUsd)
      : undefined;
  let resolvedNgn = hasNgnField
    ? incomingNgn
    : existing.priceNgn !== undefined && existing.priceNgn !== null
      ? Number(existing.priceNgn)
      : undefined;

  // Backward compatibility for older records that only have `price`
  if ((resolvedUsd === undefined || resolvedUsd === null) && !hasUsdField) {
    if (defaultCurrency === 'USD' && legacyPrice !== undefined && legacyPrice !== null) {
      resolvedUsd = legacyPrice;
    }
  }
  if ((resolvedNgn === undefined || resolvedNgn === null) && !hasNgnField) {
    if (defaultCurrency === 'NGN' && legacyPrice !== undefined && legacyPrice !== null) {
      resolvedNgn = legacyPrice;
    }
  }

  const usdValid = typeof resolvedUsd === 'number' && !Number.isNaN(resolvedUsd);
  const ngnValid = typeof resolvedNgn === 'number' && !Number.isNaN(resolvedNgn);

  if (!usdValid && !ngnValid) {
    throw new ApiError(422, 'At least one price (USD or NGN) is required');
  }

  const ctaType =
    (body.ctaType ?? existing.ctaType) === 'form' ? 'form' : 'link';
  const productUrl = body.productUrl ?? existing.productUrl ?? '';
  if (ctaType === 'link' && !productUrl) {
    throw new ApiError(422, 'Product URL is required when CTA type is link');
  }

  payload.priceUsd = usdValid ? resolvedUsd : null;
  payload.priceNgn = ngnValid ? resolvedNgn : null;
  payload.defaultCurrency = defaultCurrency;
  payload.ctaType = ctaType;
  payload.productUrl = ctaType === 'form' ? productUrl || '' : productUrl;
  payload.price =
    defaultCurrency === 'NGN'
      ? (ngnValid ? resolvedNgn : resolvedUsd) ?? 0
      : (usdValid ? resolvedUsd : resolvedNgn) ?? 0;

  // Avoid writing Mongo internals back on update
  delete payload._id;
  delete payload.__v;
  delete payload.createdAt;
  delete payload.updatedAt;

  if (!isUpdate) {
    // no-op for create path clarity
  }

  return payload;
};

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const [tracks, videos, upcomingTours, subscribers, messages, merchOrders] = await Promise.all([
    Track.countDocuments(),
    Video.countDocuments(),
    TourDate.countDocuments({ date: { $gte: new Date() } }),
    Subscriber.countDocuments(),
    ContactMessage.countDocuments({ status: 'new' }),
    MerchOrder.countDocuments({ status: 'new' }),
  ]);

  res.json({
    success: true,
    data: {
      tracks,
      videos,
      upcomingTours,
      subscribers,
      newMessages: messages,
      newMerchOrders: merchOrders,
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

const normalizeTourPayload = (body = {}) => {
  const payload = { ...body };
  const isTicketed = payload.isTicketed !== false && payload.isTicketed !== 'false';
  const ticketUrl = typeof payload.ticketUrl === 'string' ? payload.ticketUrl.trim() : '';
  const vipUrl = typeof payload.vipUrl === 'string' ? payload.vipUrl.trim() : '';

  payload.isTicketed = isTicketed;

  if (!isTicketed) {
    payload.ticketUrl = '';
    payload.vipUrl = '';
    payload.isSoldOut = false;
    return payload;
  }

  if (!ticketUrl) {
    throw new ApiError(422, 'Ticket URL is required for ticketed events');
  }

  payload.ticketUrl = ticketUrl;
  payload.vipUrl = vipUrl;
  return payload;
};

export const listTours = asyncHandler(async (req, res) => {
  const tours = await TourDate.find().sort({ date: 1 });
  res.json({ success: true, data: tours });
});

export const createTour = asyncHandler(async (req, res) => {
  handleValidation(req);
  const payload = normalizeTourPayload(req.body);
  const tour = await TourDate.create(payload);
  res.status(201).json({ success: true, data: tour });
});

export const updateTour = asyncHandler(async (req, res, next) => {
  handleValidation(req);
  const { id } = req.params;
  const tour = await TourDate.findById(id);
  if (!tour) {
    return next(new ApiError(404, 'Tour date not found'));
  }
  const payload = normalizeTourPayload({
    ...tour.toObject(),
    ...req.body,
  });
  delete payload._id;
  delete payload.__v;
  delete payload.createdAt;
  delete payload.updatedAt;
  tour.set(payload);
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
  const payload = normalizeMerchPayload(req.body, { isUpdate: false });
  const item = await MerchItem.create(payload);
  res.status(201).json({ success: true, data: item });
});

export const updateMerch = asyncHandler(async (req, res, next) => {
  handleValidation(req);
  const { id } = req.params;
  const item = await MerchItem.findById(id);
  if (!item) {
    return next(new ApiError(404, 'Merch item not found'));
  }
  const payload = normalizeMerchPayload(req.body, {
    isUpdate: true,
    existing: item.toObject(),
  });
  item.set(payload);
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

export const listMerchOrders = asyncHandler(async (req, res) => {
  const orders = await MerchOrder.find().sort({ createdAt: -1 }).populate('merchItem', 'title imageUrl');
  res.json({ success: true, data: orders });
});

export const updateMerchOrderStatus = asyncHandler(async (req, res, next) => {
  handleValidation(req);
  const { id } = req.params;
  const order = await MerchOrder.findById(id);
  if (!order) {
    return next(new ApiError(404, 'Merch order not found'));
  }
  order.status = req.body.status;
  await order.save();
  res.json({ success: true, data: order });
});

export const deleteMerchOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await MerchOrder.findById(id);
  if (!order) {
    return next(new ApiError(404, 'Merch order not found'));
  }
  await order.deleteOne();
  res.status(204).send();
});

