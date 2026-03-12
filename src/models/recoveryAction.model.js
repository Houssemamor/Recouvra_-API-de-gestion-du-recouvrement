// Module 6 - Recovery Actions Model
// Defines the RecoveryAction schema for tracking collection/recovery efforts on invoices.
// Each action is linked to an invoice and performed by an agent.

const mongoose = require("mongoose");

// Allowed recovery action types — representing contact methods or formal notices.
const ACTION_TYPES = ["call", "email", "visit", "notice", "other"];

// Possible outcomes of a recovery action.
const ACTION_RESULTS = ["pending", "promise_to_pay", "paid", "no_response", "refused", "other"];

const recoveryActionSchema = new mongoose.Schema(
  {
    // Reference to the unpaid invoice this action targets.
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    // Type of recovery action performed (call, email, visit, notice, other).
    actionType: {
      type: String,
      enum: ACTION_TYPES,
      required: true,
    },
    // Date when the action was performed. Defaults to now.
    actionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // Outcome of the action. Starts as "pending" until resolved.
    result: {
      type: String,
      enum: ACTION_RESULTS,
      default: "pending",
    },
    // Optional scheduled date for the next follow-up action.
    nextActionDate: {
      type: Date,
      default: null,
    },
    // Free-text note or context about the action.
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    // Reference to the User (agent) who performed this action.
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields.
    timestamps: true,
  }
);

module.exports = {
  RecoveryAction: mongoose.model("RecoveryAction", recoveryActionSchema),
  ACTION_TYPES,
  ACTION_RESULTS,
};
