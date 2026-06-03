import { RoleValues } from "./interfaces/roles";
import { PermissionAccessScope } from "./interfaces/permissions";
import { Permission } from "./permissions";
import type { PermissionValues } from "./interfaces/permissions";
import type { User } from "./users";

type RoleValuesWithRelations = RoleValues & {
    rolePermissions?: Array<{ permission: PermissionValues }>;
};

/**
 * Represents a role domain model.
 *
 * @public
 */
export class Role {
    /** Unique role identifier. */
    public id: number;

    /** Role name used to find it easily. */
    public name: string;

    /** Access scope assigned to the role. */
    public scope: PermissionAccessScope;

    /** Permissions assigned to the role. */
    public permissions: Permission[];

    /** Users assigned to the role. */
    public users: User[];

    /**
     * Creates a role domain model.
     *
     * @param values - Values used to initialize the role.
     */
    public constructor(values: RoleValues) {
        const roleValues = values as RoleValuesWithRelations;

        this.id = values.id;
        this.name = values.name;
        this.scope = values.scope;
        this.permissions = (values.permissions ?? roleValues.rolePermissions?.map((rolePermission) => rolePermission.permission) ?? [])
            .map((permission) => permission instanceof Permission ? permission : new Permission(permission));
        this.users = values.users ?? [];
    }
}
