const mongoose = require("mongoose");

const INVOICE_STATUSES = ["unpaid", "partial", "paid", "in_collection"];

const invoiceSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    invoiceNumber: {
      type: String,
      trim: true,
      default: "",
    },
    amountTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: INVOICE_STATUSES,
      default: "unpaid",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Invoice: mongoose.model("Invoice", invoiceSchema),
  INVOICE_STATUSES,
};
