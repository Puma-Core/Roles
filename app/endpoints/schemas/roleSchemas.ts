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
