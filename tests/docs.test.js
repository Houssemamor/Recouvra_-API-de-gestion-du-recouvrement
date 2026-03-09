const request = require("supertest");
const app = require("../src/app");

describe("Swagger docs route", () => {
  it("should expose API docs", async () => {
    const response = await request(app).get("/api/docs");

    expect([200, 301, 302, 308]).toContain(response.statusCode);
  });
});
