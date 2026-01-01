const express = require('express');
const router = express.Router();
const { getTeacherAnalytics, getAdminMetrics } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/auth');

router.get('/teacher', auth, checkRole(['teacher']), getTeacherAnalytics);
router.get('/admin', auth, checkRole(['admin']), getAdminMetrics);

module.exports = router;
