export const userSchemas = {
    UserListItem: {
        type: "object",
        properties: {
            id: { type: "number" },
            username: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            age: { type: "number" },
            nationality: { type: "string" },
            roles: {
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
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    User: {
        type: "object",
        properties: {
            id: { type: "number" },
            username: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            age: { type: "number" },
            nationality: { type: "string" },
            roles: {
                type: "array",
                items: {
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
                                                permisosId: { type: "number", nullable: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
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
