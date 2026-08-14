import * as vendorService from "./vendor.service.js";
import { createVendorSchema, updateVendorSchema } from "./vendor.validation.js";

export const createVendor = async (req, res) => {
  try {
    const { error, value } = createVendorSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const vendor = await vendorService.createVendor(value);
    return res.status(201).json({ success: true, message: "Vendor created successfully", data: vendor });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const vendors = await vendorService.getAllVendors(req.query);
    return res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getVendor = async (req, res) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    return res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { error, value } = updateVendorSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const vendor = await vendorService.updateVendor(req.params.id, value);
    return res.status(200).json({ success: true, message: "Vendor updated", data: vendor });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    await vendorService.deleteVendor(req.params.id);
    return res.status(200).json({ success: true, message: "Vendor permanently deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addInvestment = async (req, res) => {
  try {
    const { amount, note } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid investment amount" });
    }

    const vendor = await vendorService.addInvestment(req.params.id, { amount, note });
    return res.status(200).json({ success: true, message: "Investment added", data: vendor });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
