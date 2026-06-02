/**
 * Represents the available operations that can be assigned to an operation model.
 *
 * @public
 */
export type OperationType = "CREATE" | "READ" | "UPDATE" | "DELETE";

/**
 * Represents the values required to create an operation domain model.
 *
 * @public
 */
export interface OperationValues {
    /** Unique operation identifier. */
    id: string;

    /** Human-readable operation label. */
    label: string;

    /** Unique operation name. */
    name: string;

    /** Tool associated with the operation. */
    tool: string;

    /** Operations enabled for this operation model. */
    operation: OperationType[];

    /** Permission identifier associated with this operation. */
    permissionId?: string;

    /** Legacy permisos identifier associated with this operation. */
    permisosId?: string;
}
