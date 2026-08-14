import Transaction from "./transaction.model.js";
import { updateVendorBalance } from "../vendors/vendor.service.js";

export const createTransaction = async (vendorId, data, createdBy) => {
  const transaction = new Transaction({
    vendorId,
    ...data,
    createdBy,
  });

  await transaction.save();

  // Vendor Balance Logic:
  // Credit (+) = Payment Sent (Investment/Advance sent to vendor)
  // Debit (-)  = Order/Expense (Goods/Services received from vendor)
  const amountChange = data.type === "credit" ? data.amount : -data.amount;
  await updateVendorBalance(vendorId, amountChange);

  return transaction;
};

export const getTransactionsByVendor = async (vendorId) => {
  const query = vendorId ? { vendorId } : {};
  return await Transaction.find(query)
    .populate("vendorId", "name")
    .populate("createdBy", "name lastName")
    .sort({ createdAt: -1 });
};
