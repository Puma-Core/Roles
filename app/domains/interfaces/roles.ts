import { PermissionAccessScope } from "./permissions";
import { Permission } from "../permissions";

/**
 * Represents the values required to create a role domain model.
 *
 * @public
 */
export interface RoleValues {
    /** Unique role identifier. */
    id: number;

    /** Role name used to find it easily. */
    name: string;

    /** Access scope assigned to the role. */
    scope: PermissionAccessScope;

    /** Permissions assigned to the role. */
    permissions: Permission[];
}
