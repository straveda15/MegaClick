import express from 'express';
import {
  getPackagingQueue,
  getPackagingOrderDetail,
  updatePackagingStatus,
} from './packaging.controller.js';
import { protect, requirePackagingStaff } from '../../shared/middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, requirePackagingStaff);

router.get('/queue', getPackagingQueue);
router.get('/:orderId', getPackagingOrderDetail);
router.patch('/:orderId/status', updatePackagingStatus);

export default router;
