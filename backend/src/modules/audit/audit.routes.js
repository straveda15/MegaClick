import express from 'express';
import { getAllLogs } from './audit.controller.js';
import { authenticateUser, requireAdmin } from '../../shared/middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateUser, requireAdmin, getAllLogs);

export default router;
