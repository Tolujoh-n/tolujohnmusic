import { Router } from 'express';
import { body } from 'express-validator';
import { login, getProfile, updateProfile } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password is required'),
  ],
  login
);

router.get('/me', protect, getProfile);

router.put(
  '/me',
  protect,
  [
    body('name').optional().isLength({ min: 2 }).withMessage('Name is too short'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
    body('newPassword')
      .optional()
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
  ],
  updateProfile
);

export default router;

