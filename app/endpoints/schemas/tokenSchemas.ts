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
