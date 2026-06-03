export const tags = ["Tokens", "Users", "Roles", "Operations"];

export const userSchemas = {
    User: {
        type: "object",
        properties: {
            id: { type: "number" },
            username: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            age: { type: "number" },
            nationality: { type: "string" },
            roles: { type: "array", items: { type: "object" } },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    CreateUser: {
        type: "object",
        required: ["username", "firstName", "lastName", "password", "age", "nationality"],
        properties: {
            username: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            password: { type: "string" },
            age: { type: "number" },
            nationality: { type: "string" },
            roles: { type: "array", items: { type: "number" } },
        },
    },
    UpdateUser: {
        type: "object",
        properties: {
            username: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            password: { type: "string" },
            age: { type: "number" },
            nationality: { type: "string" },
            roles: { type: "array", items: { type: "number" } },
        },
    },
};

export const roleSchemas = {
    Role: {
        type: "object",
        properties: {
            id: { type: "number" },
            name: { type: "string" },
            scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
            permissions: { type: "array", items: { type: "object" } },
        },
    },
    CreateRole: {
        type: "object",
        required: ["name", "scope"],
        properties: {
            name: { type: "string" },
            scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
        },
    },
    UpdateRole: {
        type: "object",
        properties: {
            name: { type: "string" },
            scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
        },
    },
};

export const operationSchemas = {
    Operation: {
        type: "object",
        properties: {
            id: { type: "number" },
            label: { type: "string" },
            name: { type: "string" },
            tool: { type: "string" },
            operation: { type: "array", items: { type: "string", enum: ["CREATE", "READ", "UPDATE", "DELETE"] } },
            permissionId: { type: "number", nullable: true },
            permisosId: { type: "number", nullable: true },
        },
    },
    CreateOperation: {
        type: "object",
        required: ["label", "name", "tool", "operation"],
        properties: {
            label: { type: "string" },
            name: { type: "string" },
            tool: { type: "string" },
            operation: { type: "array", items: { type: "string", enum: ["CREATE", "READ", "UPDATE", "DELETE"] } },
            permissionId: { type: "number" },
            permisosId: { type: "number" },
        },
    },
    UpdateOperation: {
        type: "object",
        properties: {
            label: { type: "string" },
            name: { type: "string" },
            tool: { type: "string" },
            operation: { type: "array", items: { type: "string", enum: ["CREATE", "READ", "UPDATE", "DELETE"] } },
            permissionId: { type: "number" },
            permisosId: { type: "number" },
        },
    },
};

export const tokenSchemas = {
    Token: {
        type: "object",
        properties: {
            id: { type: "number" },
            name: { type: "string" },
            value: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            expireAt: { type: "string", format: "date-time" },
            userId: { type: "number" },
        },
    },
    LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
            username: { type: "string" },
            password: { type: "string" },
        },
    },
};

export const errorSchema = {
    type: "object",
    properties: {
        message: { type: "string" },
    },
};
