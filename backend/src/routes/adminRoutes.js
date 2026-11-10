import { Router } from 'express';
import { body } from 'express-validator';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';
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
  listMerchOrders,
  updateMerchOrderStatus,
  deleteMerchOrder,
} from '../controllers/adminController.js';
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from '../controllers/siteSettingsController.js';

const optionalSocialUrl = (field) =>
  body(`socialLinks.${field}`)
    .optional({ values: 'falsy' })
    .isURL()
    .withMessage(`${field} must be a valid URL`);

const router = Router();

router.use(protect);

router.get('/dashboard', getDashboardSummary);

router.post('/upload', upload.single('file'), uploadImage);

router
  .route('/hero')
  .get(getHeroHighlight)
  .put(
    [
      body('songTitle').notEmpty().withMessage('Song title is required'),
      body('tagline').notEmpty().withMessage('Tagline is required'),
      body('ctaUrl').isURL().withMessage('CTA URL must be valid'),
      body('freeDownloadEnabled').optional().isBoolean(),
      body('freeDownloadUrl')
        .optional({ values: 'falsy' })
        .isURL()
        .withMessage('Free download URL must be valid'),
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
      body('isTicketed').optional().isBoolean(),
      body('ticketUrl')
        .optional({ values: 'falsy' })
        .isURL()
        .withMessage('Ticket URL must be valid'),
      body('vipUrl')
        .optional({ values: 'falsy' })
        .isURL()
        .withMessage('VIP URL must be valid'),
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
      body('isTicketed').optional().isBoolean(),
      body('ticketUrl')
        .optional({ values: 'falsy' })
        .isURL()
        .withMessage('Ticket URL must be valid'),
      body('vipUrl')
        .optional({ values: 'falsy' })
        .isURL()
        .withMessage('VIP URL must be valid'),
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
      body('price').optional({ values: 'null' }).isFloat({ min: 0 }),
      body('priceUsd').optional({ values: 'null' }).isFloat({ min: 0 }),
      body('priceNgn').optional({ values: 'null' }).isFloat({ min: 0 }),
      body('defaultCurrency').optional().isIn(['USD', 'NGN']),
      body('ctaType').optional().isIn(['link', 'form']),
      body('productUrl')
        .optional({ values: 'falsy' })
        .isURL()
        .withMessage('Product URL must be valid'),
    ],
    createMerch
  );

router
  .route('/merch/:id')
  .put(
    [
      body('title').optional().notEmpty(),
      body('price').optional({ values: 'null' }).isFloat({ min: 0 }),
      body('priceUsd').optional({ values: 'null' }).isFloat({ min: 0 }),
      body('priceNgn').optional({ values: 'null' }).isFloat({ min: 0 }),
      body('defaultCurrency').optional().isIn(['USD', 'NGN']),
      body('ctaType').optional().isIn(['link', 'form']),
      body('productUrl')
        .optional({ values: 'falsy' })
        .isURL()
        .withMessage('Product URL must be valid'),
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

router.get('/merch-orders', listMerchOrders);
router.put(
  '/merch-orders/:id/status',
  [body('status').isIn(['new', 'in-progress', 'fulfilled', 'cancelled'])],
  updateMerchOrderStatus
);
router.delete('/merch-orders/:id', deleteMerchOrder);

router
  .route('/site-settings')
  .get(getAdminSiteSettings)
  .put(
    [
      optionalSocialUrl('spotify'),
      optionalSocialUrl('appleMusic'),
      optionalSocialUrl('instagram'),
      optionalSocialUrl('youtube'),
      optionalSocialUrl('facebook'),
      optionalSocialUrl('x'),
      body('brandTagline').optional({ values: 'falsy' }).isString(),
      body('contactInfo.bookingEmail')
        .optional({ values: 'falsy' })
        .isEmail()
        .withMessage('Booking email must be valid'),
      body('contactInfo.pressEmail')
        .optional({ values: 'falsy' })
        .isEmail()
        .withMessage('Press email must be valid'),
    ],
    updateAdminSiteSettings
  );

export default router;
