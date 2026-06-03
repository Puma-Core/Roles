export const roleSchemas = {
    Role: {
        type: "object",
        properties: {
            id: { type: "number" },
            name: { type: "string" },
            scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
            permissions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
                    },
                },
            },
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
        description: "Request body used to update a role. Send permission IDs in permissions when changing role-permission relations.",
        properties: {
            name: { type: "string" },
            scope: { type: "string", enum: ["API", "ADMIN", "ALL"] },
            permissions: {
                type: "array",
                description: "Permission IDs that replace the current role permissions. Do not send permission objects here.",
                items: { type: "number", description: "Permission ID" },
            },
        },
    },
};
