import { Router } from 'express';
import { body } from 'express-validator';
import protect from '../middleware/authMiddleware.js';
import {
  getDashboardSummary,
  getHeroHighlight,
  upsertHeroHighlight,
  getAboutContent,
  upsertAboutContent,
  listTracks,
  createTrack,
  updateTrack,
  deleteTrack,
  listVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  listTours,
  createTour,
  updateTour,
  deleteTour,
  listMerch,
  createMerch,
  updateMerch,
  deleteMerch,
  listSubscribers,
  listContactMessages,
  updateContactStatus,
} from '../controllers/adminController.js';

const router = Router();

router.use(protect);

router.get('/dashboard', getDashboardSummary);

router
  .route('/hero')
  .get(getHeroHighlight)
  .put(
    [
      body('songTitle').notEmpty().withMessage('Song title is required'),
      body('tagline').notEmpty().withMessage('Tagline is required'),
      body('ctaUrl').isURL().withMessage('CTA URL must be valid'),
    ],
    upsertHeroHighlight
  );

router
  .route('/about')
  .get(getAboutContent)
  .put(
    [
      body('heading').notEmpty().withMessage('Heading is required'),
      body('content').notEmpty().withMessage('Content is required'),
      body('achievements').optional().isArray(),
    ],
    upsertAboutContent
  );

router
  .route('/tracks')
  .get(listTracks)
  .post(
    [
      body('title').notEmpty(),
      body('platforms').optional().isArray(),
      body('releaseDate').optional().isISO8601(),
    ],
    createTrack
  );

router
  .route('/tracks/:id')
  .put(
    [
      body('title').optional().notEmpty(),
      body('platforms').optional().isArray(),
      body('releaseDate').optional().isISO8601(),
    ],
    updateTrack
  )
  .delete(deleteTrack);

router
  .route('/videos')
  .get(listVideos)
  .post(
    [
      body('title').notEmpty(),
      body('videoUrl').isURL(),
      body('releaseDate').optional().isISO8601(),
    ],
    createVideo
  );

router
  .route('/videos/:id')
  .put(
    [
      body('title').optional().notEmpty(),
      body('videoUrl').optional().isURL(),
      body('releaseDate').optional().isISO8601(),
    ],
    updateVideo
  )
  .delete(deleteVideo);

router
  .route('/tours')
  .get(listTours)
  .post(
    [
      body('title').notEmpty(),
      body('venue').notEmpty(),
      body('city').notEmpty(),
      body('country').notEmpty(),
      body('date').isISO8601().withMessage('Date is required'),
      body('ticketUrl').optional().isURL(),
      body('vipUrl').optional().isURL(),
    ],
    createTour
  );

router
  .route('/tours/:id')
  .put(
    [
      body('title').optional().notEmpty(),
      body('venue').optional().notEmpty(),
      body('city').optional().notEmpty(),
      body('country').optional().notEmpty(),
      body('date').optional().isISO8601(),
      body('ticketUrl').optional().isURL(),
      body('vipUrl').optional().isURL(),
    ],
    updateTour
  )
  .delete(deleteTour);

router
  .route('/merch')
  .get(listMerch)
  .post(
    [
      body('title').notEmpty(),
      body('price').isFloat({ min: 0 }),
      body('productUrl').isURL(),
    ],
    createMerch
  );

router
  .route('/merch/:id')
  .put(
    [
      body('title').optional().notEmpty(),
      body('price').optional().isFloat({ min: 0 }),
      body('productUrl').optional().isURL(),
    ],
    updateMerch
  )
  .delete(deleteMerch);

router.get('/subscribers', listSubscribers);
router.get('/messages', listContactMessages);
router.put(
  '/messages/:id/status',
  [body('status').isIn(['new', 'in-progress', 'resolved'])],
  updateContactStatus
);

export default router;

