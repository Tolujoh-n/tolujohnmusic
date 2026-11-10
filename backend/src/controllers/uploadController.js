import { cloudinary, configureCloudinary } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });

export const uploadImage = asyncHandler(async (req, res, next) => {
  if (!configureCloudinary()) {
    return next(
      new ApiError(
        503,
        'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
      )
    );
  }

  if (!req.file) {
    return next(new ApiError(400, 'No image file provided'));
  }

  const folder = process.env.CLOUDINARY_FOLDER || 'tolujohn';

  try {
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    return next(new ApiError(500, error.message || 'Failed to upload image to Cloudinary'));
  }
});
