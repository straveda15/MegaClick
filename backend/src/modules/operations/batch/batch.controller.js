import * as batchService from "./batch.service.js";
import {
  createBatchSchema,
  updateBatchSchema,
  qcSchema,
  assignShipmentSchema,
} from "./batch.validation.js";

export const createBatch = async (req, res, next) => {
  try {
    const { error, value } = createBatchSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const batch = await batchService.createBatch(value, req.user._id);
    return res.status(201).json({ success: true, message: "Batch created", data: batch });
  } catch (err) {
    next(err);
  }
};

export const getBatches = async (req, res, next) => {
  try {
    const batches = await batchService.getBatches(req.query);
    return res.status(200).json({ success: true, data: batches });
  } catch (err) {
    next(err);
  }
};

export const getBatch = async (req, res, next) => {
  try {
    const batch = await batchService.getBatchById(req.params.id);
    return res.status(200).json({ success: true, data: batch });
  } catch (err) {
    next(err);
  }
};

export const updateBatch = async (req, res, next) => {
  try {
    const { error, value } = updateBatchSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const batch = await batchService.updateBatch(req.params.id, value);
    return res.status(200).json({ success: true, message: "Batch updated", data: batch });
  } catch (err) {
    next(err);
  }
};

export const advanceStage = async (req, res, next) => {
  try {
    const batch = await batchService.advanceStage(req.params.id, req.user._id, req.body.notes);
    return res.status(200).json({
      success: true,
      message: `Batch advanced to ${batch.currentStage}`,
      data: batch,
    });
  } catch (err) {
    next(err);
  }
};

export const reserveInventory = async (req, res, next) => {
  try {
    const batch = await batchService.reserveInventory(req.params.id, req.user._id);
    return res.status(200).json({ success: true, message: "Inventory reserved", data: batch });
  } catch (err) {
    next(err);
  }
};

export const runQualityCheck = async (req, res, next) => {
  try {
    const { error, value } = qcSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const batch = await batchService.runQualityCheck(req.params.id, value, req.user._id);
    return res.status(200).json({
      success: true,
      message: `QC recorded: ${value.outcome}`,
      data: batch,
    });
  } catch (err) {
    next(err);
  }
};

export const assignShipment = async (req, res, next) => {
  try {
    const { error, value } = assignShipmentSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const batch = await batchService.assignShipment(req.params.id, value, req.user._id);
    return res.status(200).json({ success: true, message: "Shipment assigned", data: batch });
  } catch (err) {
    next(err);
  }
};

export const deleteBatch = async (req, res, next) => {
  try {
    await batchService.deleteBatch(req.params.id);
    return res.status(200).json({ success: true, message: "Batch deleted" });
  } catch (err) {
    next(err);
  }
};
