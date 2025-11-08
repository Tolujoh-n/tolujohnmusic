import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import Admin from '../models/Admin.js';

const protect = async (req, res, next) => {
  let token = null;
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return next(new ApiError(401, 'Not authorized, admin not found'));
    }

    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized, token invalid'));
  }
};

export default protect;

