const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Recouvra+ API",
      version: "1.0.0",
      description: "API REST de gestion du recouvrement (clients, factures, paiements, actions, statistiques).",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        UserRegisterInput: {
          type: "object",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", example: "123456" },
            role: { type: "string", enum: ["agent", "manager", "admin"], example: "agent" },
          },
        },
        ClientInput: {
          type: "object",
          required: ["companyName"],
          properties: {
            companyName: { type: "string", example: "Acme Corp" },
            contactName: { type: "string", example: "Sarah Martin" },
            email: { type: "string", format: "email", example: "contact@acme.com" },
            phone: { type: "string", example: "+21611112222" },
            address: { type: "string", example: "Tunis" },
            status: { type: "string", enum: ["active", "inactive", "blocked"], example: "active" },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: "Missing or invalid JWT token",
        },
        Forbidden: {
          description: "Role not allowed",
        },
      },
    },
    tags: [
      { name: "Health" },
      { name: "Auth" },
      { name: "Clients" },
      { name: "Invoices" },
      { name: "Payments" },
      { name: "RecoveryActions" },
      { name: "Stats" },
    ],
  },
  apis: ["./src/docs/swagger.paths.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function mountSwagger(app) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  mountSwagger,
};
