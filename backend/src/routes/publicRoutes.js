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
} from '../controllers/publicController.js';

const router = Router();

router.get('/home', getHomeContent);
router.get('/music', getMusic);
router.get('/videos', getVideos);
router.get('/tour-dates', getTourDates);
router.get('/merch', getMerch);

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

export default router;

