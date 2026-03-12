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
        InvoiceInput: {
          type: "object",
          required: ["client", "amountTotal", "dueDate"],
          properties: {
            client: { type: "string", example: "507f1f77bcf86cd799439011" },
            invoiceNumber: { type: "string", example: "FAC-2026-001" },
            amountTotal: { type: "number", example: 1500 },
            amountPaid: { type: "number", example: 0 },
            dueDate: { type: "string", format: "date-time", example: "2026-03-20T00:00:00.000Z" },
            status: { type: "string", enum: ["unpaid", "partial", "paid", "in_collection"], example: "unpaid" },
            notes: { type: "string", example: "Premiere facture client" },
            metadata: {
              type: "object",
              additionalProperties: true,
              example: { source: "erp" },
            },
          },
        },
        PaymentInput: {
          type: "object",
          required: ["invoice", "amount"],
          properties: {
            invoice: { type: "string", example: "507f1f77bcf86cd799439012" },
            amount: { type: "number", example: 450.5 },
            paymentDate: { type: "string", format: "date-time", example: "2026-03-12T10:00:00.000Z" },
            method: {
              type: "string",
              enum: ["cash", "bank_transfer", "check", "card", "other"],
              example: "bank_transfer",
            },
            note: { type: "string", example: "Paiement partiel verse par virement" },
          },
        },
        RecoveryActionInput: {
          type: "object",
          required: ["invoice", "actionType"],
          properties: {
            invoice: { type: "string", example: "507f1f77bcf86cd799439012" },
            actionType: {
              type: "string",
              enum: ["call", "email", "visit", "notice", "other"],
              example: "call",
            },
            actionDate: { type: "string", format: "date-time", example: "2026-03-12T14:30:00.000Z" },
            result: {
              type: "string",
              enum: ["pending", "promise_to_pay", "paid", "no_response", "refused", "other"],
              example: "promise_to_pay",
            },
            nextActionDate: { type: "string", format: "date-time", nullable: true, example: "2026-03-19T09:00:00.000Z" },
            comment: { type: "string", example: "Le client promet un paiement la semaine prochaine" },
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
