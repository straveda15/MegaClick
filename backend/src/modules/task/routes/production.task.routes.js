import express from 'express';
import {
  getMyProductionTasks,
  getAllProductionTasks,
  createProductionTask,
  claimProductionTask,
  transitionProductionTask,
} from '../controllers/production.task.controller.js';
import {
  authenticateUser,
  requireAdmin,
  requireManager,
  requireEmployeeAppAccess,
} from '../../../shared/middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// Any staff role — own task list (directly assigned + unclaimed role-bucket tasks)
router.get('/my', requireEmployeeAppAccess, getMyProductionTasks);

// Any staff role — claim an unclaimed role-bucket task
router.patch('/:id/claim', requireEmployeeAppAccess, claimProductionTask);

// Any staff role — FSM status transition (pending→in_progress→paused→completed)
router.patch('/:id/transition', requireEmployeeAppAccess, transitionProductionTask);

// Admin — list all production tasks with optional filters
router.get('/', requireAdmin, getAllProductionTasks);

// Manager/Admin — create a new production task and assign it to a role or user
router.post('/', requireManager, createProductionTask);

export default router;
