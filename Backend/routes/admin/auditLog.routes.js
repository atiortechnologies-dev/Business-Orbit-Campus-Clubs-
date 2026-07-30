/**
 * @file auditLog.routes.js
 * @description Routes for viewing and exporting audit logs.
 * @architecture Mounted under /api/admin/audit-log
 */

const express = require('express');
const { getAuditLogs, getPulse, getVolumeTrend, exportLogs } = require('../../controllers/admin/auditLog.controller');
const { protect, requireRole } = require('../../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(requireRole(['admin', 'super_admin']));

router.get('/', getAuditLogs);
router.get('/pulse', getPulse);
router.get('/volume-trend', getVolumeTrend);
router.get('/export', exportLogs);

module.exports = router;
