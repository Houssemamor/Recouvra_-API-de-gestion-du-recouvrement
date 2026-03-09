const mongoose = require("mongoose");

const PAYMENT_METHODS = ["cash", "bank_transfer", "check", "card", "other"];

const paymentSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    method: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "cash",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Payment: mongoose.model("Payment", paymentSchema),
  PAYMENT_METHODS,
};
