import { ServiceFee } from "./serviceFee.model.js";

export const listFees = async () => {
  return await ServiceFee.find({}).lean();
};

export const getFee = async (serviceSlug) => {
  return await ServiceFee.findOne({ serviceSlug }).lean();
};

export const saveFee = async (serviceSlug, feeData, userId) => {
  const { fees } = feeData;

  const update = {
    fees: Array.isArray(fees) ? fees.map(f => ({
      name: f.name || "Unnamed Fee",
      amount: Number(f.amount) || 0
    })) : [],
    updatedBy: userId,
  };

  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  };

  return await ServiceFee.findOneAndUpdate({ serviceSlug }, update, options);
};
