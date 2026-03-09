const {
  validateClientCreation,
  validateClientUpdate,
} = require("../src/validators/client.validator");

describe("Client validator", () => {
  it("should fail when companyName is missing", () => {
    const { error } = validateClientCreation({
      email: "client@test.com",
    });

    expect(error).toBeDefined();
  });

  it("should pass with valid creation payload", () => {
    const { error } = validateClientCreation({
      companyName: "Acme Corp",
      contactName: "John Doe",
      email: "john@acme.com",
      phone: "+21612345678",
      status: "active",
    });

    expect(error).toBeUndefined();
  });

  it("should fail on empty update payload", () => {
    const { error } = validateClientUpdate({});

    expect(error).toBeDefined();
  });
});
