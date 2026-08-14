import * as opsInventoryService from "./ops-inventory.service.js";
import { createInventorySchema, updateInventorySchema, adjustInventorySchema } from "./ops-inventory.validation.js";

export const applyThreshold = async (req, res) => {
  try {
    const threshold = Number(req.body?.threshold);
    if (!Number.isFinite(threshold) || threshold < 0) {
      return res.status(400).json({ success: false, message: "threshold must be a non-negative number" });
    }
    const result = await opsInventoryService.applyGlobalThreshold(threshold);
    return res.status(200).json({ success: true, message: `Threshold applied: ${result.updated} products updated`, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createInventory = async (req, res) => {
  try {
    const { error, value } = createInventorySchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const inventory = await opsInventoryService.createInventoryRecord(value);
    return res.status(201).json({ success: true, message: "Inventory record created", data: inventory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInventory = async (req, res) => {
  try {
    const inventory = await opsInventoryService.getAllInventory(req.query);
    return res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { error, value } = updateInventorySchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const inventory = await opsInventoryService.updateInventoryDetails(req.params.id, value);
    return res.status(200).json({ success: true, message: "Inventory updated", data: inventory });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const adjustInventory = async (req, res) => {
  try {
    const { error, value } = adjustInventorySchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const inventory = await opsInventoryService.adjustStock(value);
    return res.status(200).json({ success: true, message: "Stock adjusted", data: inventory });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    await opsInventoryService.deleteInventoryRecord(req.params.id);
    return res.status(200).json({ success: true, message: "Inventory deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
