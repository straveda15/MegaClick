import express from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
} from './employee-notification.controller.js';
import { authenticateUser } from '../../shared/middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/me', getMyNotifications);                  // ?filter=all|unread
router.get('/me/unread-count', getUnreadCount);
router.patch('/me/read-all', markAllRead);
router.patch('/:id/read', markAsRead);

export default router;
