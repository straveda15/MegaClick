import * as transactionService from "./transaction.service.js";
import { createTransactionSchema } from "./transaction.validation.js";

export const createTransaction = async (req, res) => {
  try {
    const { error, value } = createTransactionSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const vendorId = req.query.vendorId || req.body.vendorId;
    if (!vendorId) return res.status(400).json({ success: false, message: "Vendor ID is required" });

    const transaction = await transactionService.createTransaction(vendorId, value, req.user._id);
    return res.status(201).json({ success: true, message: "Transaction recorded", data: transaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactionsByVendor(req.query.vendorId);
    return res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
