const { validatePaymentCreation } = require("../src/validators/payment.validator");

describe("Payment validator", () => {
  it("should fail when required fields are missing", () => {
    const { error } = validatePaymentCreation({});

    expect(error).toBeDefined();
  });

  it("should pass with valid payload", () => {
    const { error } = validatePaymentCreation({
      invoice: "507f1f77bcf86cd799439011",
      amount: 250,
      paymentDate: "2026-06-01T00:00:00.000Z",
      method: "cash",
      note: "manual payment",
    });

    expect(error).toBeUndefined();
  });
});
