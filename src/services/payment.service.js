const { Payment } = require("../models/payment.model");
const { Invoice } = require("../models/invoice.model");

function computeInvoiceStatus(amountTotal, amountPaid) {
  if (amountPaid <= 0) {
    return "unpaid";
  }

  if (amountPaid >= amountTotal) {
    return "paid";
  }

  return "partial";
}

function sanitizePayment(paymentDocument) {
  return {
    id: paymentDocument._id.toString(),
    invoice: paymentDocument.invoice.toString ? paymentDocument.invoice.toString() : paymentDocument.invoice,
    amount: paymentDocument.amount,
    paymentDate: paymentDocument.paymentDate,
    method: paymentDocument.method,
    note: paymentDocument.note,
    createdAt: paymentDocument.createdAt,
    updatedAt: paymentDocument.updatedAt,
  };
}

async function createManualPayment(payload) {
  const invoice = await Invoice.findById(payload.invoice);
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.statusCode = 404;
    throw error;
  }

  const nextAmountPaid = Number(invoice.amountPaid || 0) + Number(payload.amount);
  if (nextAmountPaid > Number(invoice.amountTotal)) {
    const error = new Error("Payment exceeds remaining invoice amount");
    error.statusCode = 400;
    throw error;
  }

  const payment = await Payment.create({
    invoice: payload.invoice,
    amount: payload.amount,
    paymentDate: payload.paymentDate || new Date(),
    method: payload.method || "cash",
    note: payload.note || "",
  });

  invoice.amountPaid = nextAmountPaid;
  invoice.status = computeInvoiceStatus(Number(invoice.amountTotal), nextAmountPaid);
  await invoice.save();

  return {
    payment: sanitizePayment(payment),
    invoice: {
      id: invoice._id.toString(),
      amountTotal: invoice.amountTotal,
      amountPaid: invoice.amountPaid,
      status: invoice.status,
    },
  };
}

module.exports = {
  createManualPayment,
};
