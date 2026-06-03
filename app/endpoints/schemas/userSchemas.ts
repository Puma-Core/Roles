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
        description: "Request body used to create a user. Relations must be sent as arrays of IDs, not as full objects.",
        required: ["username", "firstName", "lastName", "password", "age", "nationality"],
        properties: {
            username: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            password: { type: "string" },
            age: { type: "number" },
            nationality: { type: "string" },
            roles: {
                type: "array",
                description: "Role IDs assigned to the user. Do not send role objects here.",
                items: { type: "number", description: "Role ID" },
            },
        },
    },
    UpdateUser: {
        type: "object",
        description: "Request body used to update a user. Send role IDs in roles when changing user-role relations.",
        properties: {
            username: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            password: { type: "string" },
            age: { type: "number" },
            nationality: { type: "string" },
            roles: {
                type: "array",
                description: "Role IDs that replace the current user roles. Do not send role objects here.",
                items: { type: "number", description: "Role ID" },
            },
        },
    },
};
