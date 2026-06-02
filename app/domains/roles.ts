import { RoleValues } from "./interfaces/roles";
import { PermissionAccessScope } from "./interfaces/permissions";
import { Permission } from "./permissions";

/**
 * Represents a role domain model.
 *
 * @public
 */
export class Role {
    /** Unique role identifier. */
    public id: string;

    /** Role name used to find it easily. */
    public name: string;

    /** Access scope assigned to the role. */
    public scope: PermissionAccessScope;

    /** Permissions assigned to the role. */
    public permissions: Permission[];

    /**
     * Creates a role domain model.
     *
     * @param values - Values used to initialize the role.
     */
    public constructor(values: RoleValues) {
        this.id = values.id;
        this.name = values.name;
        this.scope = values.scope;
        this.permissions = values.permissions;
    }
}
