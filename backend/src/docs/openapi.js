// Minimal OpenAPI spec (Phase 1). We'll expand it as endpoints stabilize.
module.exports = {
  openapi: "3.0.3",
  info: {
    title: "FraudShield AI API",
    version: "1.0.0",
    description: "FraudShield AI backend API (auth, alerts, transactions, reports)."
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    "/": {
      get: {
        summary: "API index",
        responses: {
          200: { description: "OK" }
        }
      }
    },
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          200: { description: "OK" }
        }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login",
        requestBody: { required: true },
        responses: {
          200: { description: "OK" },
          400: { description: "Validation error" },
          401: { description: "Invalid credentials" }
        }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register",
        requestBody: { required: true },
        responses: {
          201: { description: "Created" }
        }
      }
    },
    "/transactions/analyze": {
      post: {
        summary: "Analyze a transaction (risk scoring)",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true },
        responses: {
          201: { description: "Created" },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/ip/check": {
      post: {
        summary: "Check IP reputation",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true },
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized" }
        }
      }
    },
    "/audit-logs": {
      get: {
        summary: "List audit logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "action", in: "query", schema: { type: "string" } }
        ],
        responses: {
          200: { description: "OK" },
          401: { description: "Unauthorized" }
        }
      }
    }
  }
};
