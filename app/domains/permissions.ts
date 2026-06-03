import { PermissionAccessScope, PermissionValues } from "./interfaces/permissions";
import { Operation } from "./operations";

/**
 * Represents a permission domain model.
 *
 * @public
 */
export class Permission {
    /** Unique permission identifier. */
    public id: number;

    /** Permission name used to find it easily. */
    public name: string;

    /** Access scope assigned to the permission. */
    public scope: PermissionAccessScope;

    /** Operations assigned to the permission. */
    public operations: Operation[];

    /** Role permission relations assigned to the permission. */
    public rolePermissions: unknown[];

    /**
     * Creates a permission domain model.
     *
     * @param values - Values used to initialize the permission.
     */
    public constructor(values: PermissionValues) {
        this.id = values.id;
        this.name = values.name;
        this.scope = values.scope;
        this.operations = (values.operations ?? []).map((operation) => operation instanceof Operation ? operation : new Operation(operation));
        this.rolePermissions = values.rolePermissions ?? [];
    }
}
