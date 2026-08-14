import * as rawMaterialService from "./raw-material.service.js";
import { createRawMaterialSchema, updateRawMaterialSchema, consumeReceiveRawMaterialSchema } from "./raw-material.validation.js";

export const createRawMaterial = async (req, res) => {
  try {
    const { error, value } = createRawMaterialSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const material = await rawMaterialService.createRawMaterial(value);
    return res.status(201).json({ success: true, message: "Raw Material created", data: material });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRawMaterials = async (req, res) => {
  try {
    const materials = await rawMaterialService.getAllRawMaterials(req.query);
    return res.status(200).json({ success: true, data: materials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRawMaterial = async (req, res) => {
  try {
    const material = await rawMaterialService.getRawMaterialById(req.params.id);
    return res.status(200).json({ success: true, data: material });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const updateRawMaterial = async (req, res) => {
  try {
    const { error, value } = updateRawMaterialSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const material = await rawMaterialService.updateRawMaterial(req.params.id, value);
    return res.status(200).json({ success: true, message: "Raw Material updated", data: material });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteRawMaterial = async (req, res) => {
  try {
    await rawMaterialService.deleteRawMaterial(req.params.id);
    return res.status(200).json({ success: true, message: "Raw Material deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const consumeStock = async (req, res) => {
  try {
    const { error, value } = consumeReceiveRawMaterialSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const material = await rawMaterialService.consumeStock(req.params.id, value.quantity);
    return res.status(200).json({ success: true, message: "Stock consumed", data: material });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const receiveStock = async (req, res) => {
  try {
    const { error, value } = consumeReceiveRawMaterialSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const material = await rawMaterialService.receiveStock(req.params.id, value.quantity);
    return res.status(200).json({ success: true, message: "Stock received", data: material });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
