import { validationResult } from 'express-validator';
import SiteSettings from '../models/SiteSettings.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  defaultBrandName,
  defaultBrandTagline,
  defaultContactInfo,
  defaultPageContent,
  defaultSectionContent,
  defaultSiteDescription,
  defaultSiteKeywords,
  defaultSiteTitle,
  defaultSiteUrl,
  emptySocialLinks,
  mergeCopyMapUpdate,
  normalizeContactInfo,
  normalizeSocialLinks,
  serializeSiteSettings,
} from '../utils/siteSettingsDefaults.js';

const getOrCreateSettings = async () => {
  let settings = await SiteSettings.findOne().sort({ updatedAt: -1 });
  if (!settings) {
    settings = await SiteSettings.create({
      brandName: defaultBrandName,
      brandTagline: defaultBrandTagline,
      brandLogo: '',
      siteTitle: defaultSiteTitle,
      siteDescription: defaultSiteDescription,
      siteKeywords: defaultSiteKeywords,
      ogImage: '',
      siteUrl: defaultSiteUrl,
      socialLinks: emptySocialLinks,
      pageContent: defaultPageContent,
      sectionContent: defaultSectionContent,
      contactInfo: defaultContactInfo,
    });
  }
  return settings;
};

export const getPublicSiteSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({
    success: true,
    data: serializeSiteSettings(settings),
  });
});

export const getAdminSiteSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({
    success: true,
    data: serializeSiteSettings(settings),
  });
});

export const updateAdminSiteSettings = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(422, 'Validation error', errors.array()));
  }

  const settings = await getOrCreateSettings();
  const current = serializeSiteSettings(settings);

  const assignTrimmed = (field, fallback = '') => {
    if (!Object.prototype.hasOwnProperty.call(req.body, field)) return;
    const value = req.body[field];
    settings[field] =
      typeof value === 'string' && value.trim() ? value.trim() : fallback;
  };

  assignTrimmed('brandName', defaultBrandName);
  assignTrimmed('brandTagline', defaultBrandTagline);
  assignTrimmed('brandLogo', '');
  assignTrimmed('siteTitle', defaultSiteTitle);
  assignTrimmed('siteDescription', defaultSiteDescription);
  assignTrimmed('siteKeywords', defaultSiteKeywords);
  assignTrimmed('ogImage', '');
  assignTrimmed('siteUrl', defaultSiteUrl);

  if (req.body.socialLinks) {
    settings.socialLinks = normalizeSocialLinks(req.body.socialLinks);
  }

  if (req.body.pageContent) {
    settings.pageContent = mergeCopyMapUpdate(
      current.pageContent,
      req.body.pageContent,
      defaultPageContent
    );
  }

  if (req.body.sectionContent) {
    settings.sectionContent = mergeCopyMapUpdate(
      current.sectionContent,
      req.body.sectionContent,
      defaultSectionContent
    );
  }

  if (req.body.contactInfo) {
    settings.contactInfo = normalizeContactInfo(
      { ...current.contactInfo, ...req.body.contactInfo },
      false
    );
  }

  await settings.save();

  res.json({
    success: true,
    data: serializeSiteSettings(settings),
  });
});
