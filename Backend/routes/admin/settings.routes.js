/**
 * @file settings.routes.js
 * @description Routes for platform settings, profile, and security.
 * @architecture Mounted under /api/admin/settings
 */

const express = require('express');
const { 
  getSettings, 
  updatePlatformSettings, 
  exportConfig,
  updateProfile,
  updateNotifications,
  getLoginHistory,
  logoutAllDevices,
  changePassword,
  downloadSystemLogs
} = require('../../controllers/admin/settings.controller');
const { protect, requireRole } = require('../../middlewares/authMiddleware');
const s3ImageUpload = require('../../middlewares/s3Upload.middleware');

const router = express.Router();

router.use(protect);

router.get('/', requireRole(['admin', 'super_admin']), getSettings);
router.put('/platform', requireRole(['super_admin']), s3ImageUpload.single('logo'), updatePlatformSettings);
router.get('/export-config', requireRole(['super_admin']), exportConfig);

router.put('/profile', requireRole(['admin', 'super_admin']), s3ImageUpload.single('avatar'), updateProfile);
router.put('/notifications', requireRole(['admin', 'super_admin']), updateNotifications);
router.get('/login-history', requireRole(['admin', 'super_admin']), getLoginHistory);
router.post('/logout-all-devices', requireRole(['super_admin']), logoutAllDevices);
router.post('/change-password', requireRole(['admin', 'super_admin']), changePassword);
router.get('/download-system-logs', requireRole(['super_admin']), downloadSystemLogs);

module.exports = router;
