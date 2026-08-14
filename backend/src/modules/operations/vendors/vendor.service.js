import Vendor from "./vendor.model.js";

export const createVendor = async (data) => {
  if (data.initialInvestment !== undefined && data.openingBalance === undefined) {
    data.openingBalance = data.initialInvestment;
  } else if (data.initialInvestment !== undefined) {
    data.openingBalance = data.initialInvestment;
  }
  data.currentBalance = data.openingBalance || 0;
  const vendor = new Vendor(data);
  await vendor.save();
  return vendor;
};

export const getAllVendors = async (filters = {}) => {
  const query = { ...filters };
  return await Vendor.find(query).sort({ createdAt: -1 });
};

export const getVendorById = async (id) => {
  const vendor = await Vendor.findById(id);
  if (!vendor) throw new Error("Vendor not found");
  return vendor;
};

export const updateVendor = async (id, data) => {
  const vendor = await Vendor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!vendor) throw new Error("Vendor not found");
  return vendor;
};

export const deleteVendor = async (id) => {
  const vendor = await Vendor.findByIdAndDelete(id);
  if (!vendor) throw new Error("Vendor not found");
  return vendor;
};

export const updateVendorBalance = async (id, amountChange) => {
    const vendor = await Vendor.findById(id);
    if (!vendor) throw new Error("Vendor not found for balance update");

    vendor.currentBalance += amountChange;
    await vendor.save();
    return vendor;
};

export const addInvestment = async (id, { amount, note }) => {
  const vendor = await Vendor.findById(id);
  if (!vendor) throw new Error("Vendor not found");

  if (vendor.status !== 'active') {
    const err = new Error("Cannot add investment to inactive vendor");
    err.statusCode = 400;
    throw err;
  }

  if (amount <= 0) throw new Error("Investment amount must be positive");

  vendor.investments.push({ amount, note, date: new Date() });
  vendor.currentBalance += amount;
  
  await vendor.save();
  return vendor;
};
