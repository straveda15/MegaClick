import * as productionBatchService from './production.batch.service.js';

export const getMyBatches = async (req, res, next) => {
  try {
    const { currentStage } = req.query;
    const batches = await productionBatchService.getMyBatches(req.user, { currentStage });
    res.status(200).json({ success: true, data: batches });
  } catch (err) {
    next(err);
  }
};

export const getMyBatchById = async (req, res, next) => {
  try {
    const batch = await productionBatchService.getMyBatchById(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
};

export const assignBatchStage = async (req, res, next) => {
  try {
    const { stageName, assignedTo } = req.body;
    if (!stageName || !assignedTo) {
      return res.status(400).json({ success: false, message: 'stageName and assignedTo are required' });
    }
    const batch = await productionBatchService.assignBatchStage(req.params.id, stageName, assignedTo);
    res.status(200).json({ success: true, message: 'Stage assigned', data: batch });
  } catch (err) {
    next(err);
  }
};
