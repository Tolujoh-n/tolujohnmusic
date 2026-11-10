import { Router } from 'express';
import { body } from 'express-validator';
import {
  getHomeContent,
  getMusic,
  getVideos,
  getTourDates,
  getMerch,
  subscribe,
  submitContactMessage,
  submitMerchOrder,
} from '../controllers/publicController.js';
import { getPublicSiteSettings } from '../controllers/siteSettingsController.js';

const router = Router();

router.get('/home', getHomeContent);
router.get('/music', getMusic);
router.get('/videos', getVideos);
router.get('/tour-dates', getTourDates);
router.get('/merch', getMerch);
router.get('/site-settings', getPublicSiteSettings);

router.post(
  '/subscribe',
  [body('email').isEmail().withMessage('Valid email is required')],
  subscribe
);

router.post(
  '/contact',
  [
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message')
      .isLength({ min: 10 })
      .withMessage('Message must be at least 10 characters'),
  ],
  submitContactMessage
);

router.post(
  '/merch-orders',
  [
    body('merchItemId').notEmpty().withMessage('Merch item is required'),
    body('name').isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').isLength({ min: 7 }).withMessage('Phone number is required'),
    body('addressLine1').isLength({ min: 3 }).withMessage('Address is required'),
    body('city').isLength({ min: 2 }).withMessage('City is required'),
    body('state').isLength({ min: 2 }).withMessage('State is required'),
    body('country').isLength({ min: 2 }).withMessage('Country is required'),
    body('postalCode').optional({ values: 'falsy' }).isString(),
    body('addressLine2').optional({ values: 'falsy' }).isString(),
    body('notes').optional({ values: 'falsy' }).isString(),
    body('quantity').optional().isInt({ min: 1 }),
    body('currency').optional().isIn(['USD', 'NGN']),
  ],
  submitMerchOrder
);

export default router;
