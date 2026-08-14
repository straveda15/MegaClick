import express from 'express';
import {
  getMyPayslips,
  getMyPayslipByMonth,
  downloadPayslip,
  generatePayslip,
  getAllPayslips,
} from './payslip.controller.js';
import {
  authenticateUser,
  requireAdmin,
  requireHR,
} from '../../shared/middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);

// Self-service — any authenticated user
router.get('/me', getMyPayslips);
router.get('/me/:month', getMyPayslipByMonth);   // month = YYYY-MM
router.get('/:id/download', downloadPayslip);

// Admin/HR — generate and list
router.post('/generate', requireHR, generatePayslip);
router.get('/', requireAdmin, getAllPayslips);

export default router;
