import express from 'express';
import { getMyBatches, getMyBatchById, assignBatchStage } from './production.batch.controller.js';
import { authenticateUser, requireProductionStaff, requireManager } from '../../../shared/middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateUser);

// Production staff — own batch list and detail
router.get('/my', requireProductionStaff, getMyBatches);
router.get('/my/:id', requireProductionStaff, getMyBatchById);

// Manager/Admin — assign a stage to a user
router.patch('/:id/assign-stage', requireManager, assignBatchStage);

export default router;
