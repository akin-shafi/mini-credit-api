import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import jwt from "jsonwebtoken";

export const setupSwagger = (app: Express) => {
  const secret = process.env.JWT_SECRET || "supersecret";

  // Example JWTs for seeded users
  const adminToken = jwt.sign(
    { id: 1, email: "admin@test.com", role: "admin" },
    secret,
    { expiresIn: "1h" }
  );
  const userToken = jwt.sign(
    { id: 2, email: "user@test.com", role: "user" },
    secret,
    { expiresIn: "1h" }
  );

  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Mini Credit Insights API",
        version: "1.0.0",
        description: "API documentation for the Mini Credit Insights Service",
      },
      servers: [{ url: "http://localhost:3000/api" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Use JWT tokens (see examples below)",
          },
        },
        examples: {
          AdminToken: {
            summary: "Admin JWT Example",
            value: `Bearer ${adminToken}`,
          },
          UserToken: {
            summary: "User JWT Example",
            value: `Bearer ${userToken}`,
          },
          UserExample: {
            summary: "User object",
            value: {
              id: 2,
              email: "user@test.com",
              role: "user",
              createdAt: "2025-01-01T12:00:00.000Z",
              updatedAt: "2025-01-01T12:00:00.000Z",
            },
          },
          StatementExample: {
            summary: "Statement object",
            value: {
              id: 1,
              userId: 2,
              filePath: "seeded.csv",
              uploadedAt: "2025-01-01T12:00:00.000Z",
            },
          },
          TransactionExample: {
            summary: "Transaction object",
            value: {
              id: 1,
              statementId: 1,
              date: "2025-01-01",
              description: "Salary Payment",
              amount: 3000.0,
              balance: 3000.0,
            },
          },
          InsightExample: {
            summary: "Insight object",
            value: {
              id: 1,
              userId: 2,
              avgIncome: 2500.0,
              totalInflow: 5000.0,
              totalOutflow: 2300.0,
              netFlow: 2700.0,
              spendBuckets: {
                food: 500,
                bills: 1200,
                others: 600,
              },
              riskFlags: [],
              createdAt: "2025-01-01T12:00:00.000Z",
            },
          },
          BureauReportExample: {
            summary: "Example Bureau Report",
            value: {
              id: 1,
              userId: 2,
              score: 720,
              risk_band: "LOW",
              enquiries_6m: 1,
              defaults: 0,
              open_loans: 2,
              trade_lines: 3,
              createdAt: "2025-08-22T12:00:00Z",
            },
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: { type: "integer" },
              email: { type: "string" },
              role: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          Statement: {
            type: "object",
            properties: {
              id: { type: "integer" },
              userId: { type: "integer" },
              filePath: { type: "string" },
              uploadedAt: { type: "string", format: "date-time" },
            },
          },
          Transaction: {
            type: "object",
            properties: {
              id: { type: "integer" },
              statementId: { type: "integer" },
              date: { type: "string" },
              description: { type: "string" },
              amount: { type: "number" },
              balance: { type: "number" },
            },
          },
          Insight: {
            type: "object",
            properties: {
              id: { type: "integer" },
              userId: { type: "integer" },
              avgIncome: { type: "number" },
              totalInflow: { type: "number" },
              totalOutflow: { type: "number" },
              netFlow: { type: "number" },
              spendBuckets: { type: "object" },
              riskFlags: { type: "array", items: { type: "string" } },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          BureauReport: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              userId: { type: "integer", example: 2 },
              score: { type: "integer", example: 720 },
              risk_band: { type: "string", example: "LOW" },
              enquiries_6m: { type: "integer", example: 1 },
              defaults: { type: "integer", example: 0 },
              open_loans: { type: "integer", example: 2 },
              trade_lines: { type: "integer", example: 3 },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2025-08-22T12:00:00Z",
              },
            },
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/*.ts"],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};
