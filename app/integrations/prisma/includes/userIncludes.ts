export const USER_ROLES_INCLUDE = {
    roles: true,
} as const;

export const USER_FULL_INCLUDE = {
    roles: {
        include: {
            rolePermissions: {
                include: {
                    permission: {
                        include: {
                            operations: true,
                        },
                    },
                },
            },
        },
    },
} as const;
