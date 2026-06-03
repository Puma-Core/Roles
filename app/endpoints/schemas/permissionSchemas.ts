export const permissionSchemas = {
    Permission: {
        type: "object",
        properties: {
            id: { type: "number" },
            name: { type: "string" },
            scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
            operations: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        label: { type: "string" },
                        name: { type: "string" },
                        tool: { type: "string" },
                        operation: {
                            type: "array",
                            items: { type: "string", enum: ["CREATE", "READ", "UPDATE", "DELETE"] },
                        },
                        permissionId: { type: "number", nullable: true },
                    },
                },
            },
        },
    },
    CreatePermission: {
        type: "object",
        required: ["name", "scope"],
        properties: {
            name: { type: "string" },
            scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
        },
    },
    UpdatePermission: {
        type: "object",
        description: "Request body used to update a permission. Send operation IDs in operations when changing permission-operation relations.",
        properties: {
            name: { type: "string" },
            scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
            operations: {
                type: "array",
                description: "Operation IDs that replace the current permission operations. Do not send operation objects here.",
                items: { type: "number", description: "Operation ID" },
            },
        },
    },
};
