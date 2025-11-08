import { validationResult } from 'express-validator';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

export const login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Validation error', errors.array()));
  }

  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const match = await admin.matchPassword(password);
  if (!match) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  const token = generateToken(admin._id);

  res.json({
    success: true,
    data: {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);
  res.json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Validation error', errors.array()));
  }

  const admin = await Admin.findById(req.admin._id).select('+password');

  if (!admin) {
    return next(new ApiError(404, 'Admin not found'));
  }

  const { name, email, currentPassword, newPassword } = req.body;

  if (name) admin.name = name;
  if (email) admin.email = email;

  if (newPassword) {
    if (!currentPassword) {
      return next(new ApiError(422, 'Current password is required'));
    }

    const match = await admin.matchPassword(currentPassword);

    if (!match) {
      return next(new ApiError(401, 'Current password is incorrect'));
    }

    admin.password = newPassword;
  }

  await admin.save();

  res.json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

