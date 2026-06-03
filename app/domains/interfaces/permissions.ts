import { Operation } from "../operations";

/**
 * Represents the available access scopes for a permission domain model.
 *
 * @public
 */
export type PermissionAccessScope = "API" | "ADMIN" | "ALL";

/**
 * Represents the values required to create a permission domain model.
 *
 * @public
 */
export interface PermissionValues {
    /** Unique permission identifier. */
    id: number;

    /** Permission name used to find it easily. */
    name: string;

    /** Access scope assigned to the permission. */
    scope: PermissionAccessScope;

    /** Operations assigned to the permission. */
    operations?: Operation[];

    /** Role permission relations assigned to the permission. */
    rolePermissions?: unknown[];
}
