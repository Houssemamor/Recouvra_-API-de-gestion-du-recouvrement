const mongoose = require("mongoose");

const ACTION_TYPES = ["call", "email", "visit", "notice", "other"];
const ACTION_RESULTS = ["pending", "promise_to_pay", "paid", "no_response", "refused", "other"];

const recoveryActionSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    actionType: {
      type: String,
      enum: ACTION_TYPES,
      required: true,
    },
    actionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    result: {
      type: String,
      enum: ACTION_RESULTS,
      default: "pending",
    },
    nextActionDate: {
      type: Date,
      default: null,
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  RecoveryAction: mongoose.model("RecoveryAction", recoveryActionSchema),
  ACTION_TYPES,
  ACTION_RESULTS,
};
