const {
  validateRecoveryActionCreation,
  validateRecoveryActionUpdate,
  validateRecoveryActionQuery,
} = require("../src/validators/recoveryAction.validator");

describe("Recovery action validator", () => {
  it("should fail when required fields are missing", () => {
    const { error } = validateRecoveryActionCreation({});
    expect(error).toBeDefined();
  });

  it("should pass with valid creation payload", () => {
    const { error } = validateRecoveryActionCreation({
      invoice: "507f1f77bcf86cd799439011",
      actionType: "call",
      result: "pending",
      comment: "First contact",
    });

    expect(error).toBeUndefined();
  });

  it("should fail on empty update payload", () => {
    const { error } = validateRecoveryActionUpdate({});
    expect(error).toBeDefined();
  });

  it("should pass with valid query filters", () => {
    const { error } = validateRecoveryActionQuery({
      client: "507f1f77bcf86cd799439011",
      actionType: "email",
      from: "2026-01-01T00:00:00.000Z",
      to: "2026-12-31T00:00:00.000Z",
    });

    expect(error).toBeUndefined();
  });
});
