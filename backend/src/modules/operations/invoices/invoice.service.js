import Invoice from "./invoice.model.js";

export const createInvoice = async (vendorId, data, createdBy) => {
  let totalAmount = 0;
  
  data.items = data.items.map(item => {
    const amount = item.qty * item.rate;
    totalAmount += amount;
    return { ...item, amount };
  });

  const invoice = new Invoice({
    vendorId,
    ...data,
    totalAmount,
    dueAmount: totalAmount,
    paidAmount: 0,
    status: "unpaid"
  });

  await invoice.save();

  try {
    const { createTransaction } = await import("../transactions/transaction.service.js");
    await createTransaction(vendorId, {
      type: "credit",
      amount: totalAmount,
      referenceType: "invoice",
      referenceId: invoice._id,
      note: `Invoice ${invoice.invoiceNumber}`,
    }, createdBy);
  } catch (err) {
      console.error("Failed to create vendor credit transaction:", err.message);
  }

  const now = new Date();
  const diffDays = Math.ceil((new Date(invoice.dueDate) - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 2) {
    try {
        const { createNotification } = await import("../notifications/ops-notification.service.js");
        await createNotification({
            title: `Payment Due Soon`,
            message: `Invoice ${invoice.invoiceNumber} is due on ${invoice.dueDate.toDateString()}`,
            type: "payment_due",
            entityId: invoice._id,
            roleTarget: "admin",
        });
    } catch (err) {
        console.error("Failed to create notification:", err.message);
    }
  }

  return invoice;
};

export const getInvoicesByVendor = async (vendorId) => {
  return await Invoice.find({ vendorId }).sort({ invoiceDate: -1 });
};

export const getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id).populate("vendorId", "name phone email");
  if (!invoice) throw new Error("Invoice not found");
  return invoice;
};

export const payInvoice = async (id, amount, note, createdBy) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new Error("Invoice not found");

  if (invoice.status === "paid") {
    throw new Error("Invoice is already fully paid");
  }

  if (amount > invoice.dueAmount) {
    throw new Error(`Payment amount (${amount}) exceeds due amount (${invoice.dueAmount})`);
  }

  invoice.paidAmount += amount;
  invoice.dueAmount -= amount;

  if (invoice.dueAmount === 0) {
    invoice.status = "paid";
  } else {
    invoice.status = "partial";
  }

  await invoice.save();

  try {
    const { createTransaction } = await import("../transactions/transaction.service.js");
    await createTransaction(invoice.vendorId, {
      type: "debit",
      amount: amount,
      referenceType: "payment",
      referenceId: invoice._id,
      note: note || `Payment for Invoice ${invoice.invoiceNumber}`,
    }, createdBy);
  } catch (err) {
      console.error("Failed to create vendor debit transaction:", err.message);
  }

  return invoice;
};
