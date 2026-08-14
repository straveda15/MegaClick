import * as invoiceService from "./invoice.service.js";
import { createInvoiceSchema, payInvoiceSchema } from "./invoice.validation.js";

export const createInvoice = async (req, res) => {
  try {
    const vendorId = req.query.vendorId;
    if (!vendorId) return res.status(400).json({ success: false, message: "vendorId query param is required" });

    const { error, value } = createInvoiceSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const invoice = await invoiceService.createInvoice(vendorId, value, req.user._id);
    return res.status(201).json({ success: true, message: "Invoice created successfully", data: invoice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const vendorId = req.query.vendorId;
    if (!vendorId) return res.status(400).json({ success: false, message: "vendorId query param is required" });

    const invoices = await invoiceService.getInvoicesByVendor(vendorId);
    return res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const payInvoice = async (req, res) => {
  try {
    const { error, value } = payInvoiceSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const invoice = await invoiceService.payInvoice(req.params.id, value.amount, value.note, req.user._id);
    return res.status(200).json({ success: true, message: "Payment recorded", data: invoice });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
