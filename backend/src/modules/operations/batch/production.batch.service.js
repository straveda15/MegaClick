import Batch, { BATCH_STAGES, getBatchProgress } from './batch.model.js';
import AppError from '../../../shared/utils/appError.js';

// Roles that get the FULL list of production batches (not just their
// own stage assignments) when calling /batches/my. (BUG_174)
const ADMIN_LIKE_ROLES = new Set(['admin', 'hr', 'manager', 'business_analyst']);
const isAdminLike = (user) =>
  ADMIN_LIKE_ROLES.has(user?.role) || ADMIN_LIKE_ROLES.has(user?.departmentRole);

/**
 * Return batches relevant to the caller.
 * - Production staff: only batches where THEY have a stage assignment.
 * - Admin / HR / Manager / Business Analyst: ALL active batches.
 *
 * `yourStages` is computed per-user (empty array for admin).
 */
// Early stages a production worker may claim before anyone is assigned. A new
// batch is created at CREATED and first assigned to WAREHOUSE (inventory pick),
// so without this it never surfaces to production until warehouse reserves it.
// Production can advance CREATED → INVENTORY_RESERVED → MIXING themselves via the
// "Start Batch" action, so these must be visible (and actionable) to them.
const CLAIMABLE_STAGES = ['CREATED', 'INVENTORY_RESERVED'];
const isProduction = (user) =>
  user?.role === 'production_staff' ||
  user?.currentOperationalRole === 'production' ||
  (Array.isArray(user?.operationalRoles) && user.operationalRoles.includes('production'));

export const getMyBatches = async (user, filters = {}) => {
  const userId = user?._id ?? user;
  const adminView = isAdminLike(user);

  let query;
  if (adminView) {
    query = {};
  } else if (isProduction(user)) {
    // Production staff: their own assignments PLUS unclaimed early-stage batches.
    query = {
      $or: [
        { 'stageAssignments.assignedTo': userId },
        { currentStage: { $in: CLAIMABLE_STAGES } },
      ],
    };
  } else {
    // Other ops staff (e.g. warehouse-only): strictly their own assignments.
    query = { 'stageAssignments.assignedTo': userId };
  }
  if (filters.currentStage) query.currentStage = filters.currentStage;

  const batches = await Batch.find(query)
    .populate('productId', 'name images')
    .populate('stageAssignments.assignedTo', 'name lastName')
    .sort({ dueDate: 1, createdAt: -1 });

  return batches.map((b) => {
    const obj = b.toObject();
    obj.yourStages = obj.stageAssignments
      .filter((a) => a.assignedTo?._id?.toString() === userId?.toString())
      .map((a) => a.stageName);
    obj.totalStages = BATCH_STAGES.length;
    obj.currentStageIndex = BATCH_STAGES.indexOf(obj.currentStage);
    obj.progressPercent = getBatchProgress(obj.currentStage);
    return obj;
  });
};

/**
 * Single batch detail, scoped to the requesting user (must have a stage assignment).
 */
export const getMyBatchById = async (batchId, userId) => {
  const batch = await Batch.findOne({
    _id: batchId,
    'stageAssignments.assignedTo': userId,
  })
    .populate('productId', 'name images')
    .populate('assignedEmployees', 'name lastName')
    .populate('stageAssignments.assignedTo', 'name lastName')
    .populate('createdBy', 'name lastName');

  if (!batch) throw new AppError('Batch not found or not assigned to you', 404);

  const obj = batch.toObject();
  obj.yourStages = obj.stageAssignments
    .filter((a) => a.assignedTo?._id?.toString() === userId.toString())
    .map((a) => a.stageName);
  obj.totalStages = BATCH_STAGES.length;
  obj.currentStageIndex = BATCH_STAGES.indexOf(obj.currentStage);
  obj.progressPercent = getBatchProgress(obj.currentStage);

  return obj;
};

/**
 * Assign a stage to a user (admin/manager operation).
 * Replaces any existing assignment for that stage.
 */
export const assignBatchStage = async (batchId, stageName, assignedTo) => {
  if (!BATCH_STAGES.includes(stageName)) {
    throw new AppError(`Invalid stageName. Must be one of: ${BATCH_STAGES.join(', ')}`, 400);
  }

  const batch = await Batch.findById(batchId);
  if (!batch) throw new AppError('Batch not found', 404);

  // Remove any existing assignment for this stage, then push new one
  batch.stageAssignments = batch.stageAssignments.filter((a) => a.stageName !== stageName);
  batch.stageAssignments.push({ stageName, assignedTo, assignedAt: new Date() });

  // Also keep assignedEmployees in sync (legacy field)
  const alreadyListed = batch.assignedEmployees.some(
    (id) => id.toString() === assignedTo.toString()
  );
  if (!alreadyListed) batch.assignedEmployees.push(assignedTo);

  await batch.save();
  return batch;
};
