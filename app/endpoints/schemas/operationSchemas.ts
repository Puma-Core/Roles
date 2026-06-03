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
        },
    },
};
