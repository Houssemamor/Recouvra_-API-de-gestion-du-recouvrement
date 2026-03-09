const {
  validateInvoiceCreation,
  validateInvoiceUpdate,
  validateInvoiceQuery,
} = require("../src/validators/invoice.validator");

describe("Invoice validator", () => {
  it("should fail when required fields are missing", () => {
    const { error } = validateInvoiceCreation({});

    expect(error).toBeDefined();
  });

  it("should pass with a valid creation payload", () => {
    const { error } = validateInvoiceCreation({
      client: "507f1f77bcf86cd799439011",
      invoiceNumber: "INV-001",
      amountTotal: 1000,
      amountPaid: 200,
      dueDate: "2026-12-01T00:00:00.000Z",
      status: "partial",
    });

    expect(error).toBeUndefined();
  });

  it("should fail on empty update payload", () => {
    const { error } = validateInvoiceUpdate({});

    expect(error).toBeDefined();
  });

  it("should pass with valid query filters", () => {
    const { error } = validateInvoiceQuery({
      status: "unpaid",
      client: "507f1f77bcf86cd799439011",
      dueDateFrom: "2026-01-01T00:00:00.000Z",
      dueDateTo: "2026-12-31T00:00:00.000Z",
    });

    expect(error).toBeUndefined();
  });
});
