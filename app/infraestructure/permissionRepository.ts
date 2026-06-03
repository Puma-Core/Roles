import { BaseRepository, RepositoryConstructor } from "./baseRepository";
import { Permission } from "../domains/permissions";
import { PermissionValues } from "../domains/interfaces/permissions";
import { RepositoryQueryArgs } from "./interfaces/repository";

/** Data required to create a permission. */
export type CreatePermissionData = Omit<PermissionValues, "id" | "operations" | "rolePermissions">;

/** Data allowed to update a permission. */
export type UpdatePermissionData = Partial<CreatePermissionData> & { operations?: number[] };

/**
 * Permission repository bound to the permission domain model.
 *
 * The concrete storage implementation is provided through the constructor, so this repository
 * does not need to know which ORM or database driver is being used.
 *
 * @public
 */
export class PermissionRepository extends BaseRepository<Permission, CreatePermissionData, UpdatePermissionData, number> {
    /** Prisma model name used by the concrete repository implementation. */
    public static readonly TABLE_NAME = "Permission";
    public static readonly MODEL = Permission;

    /**
     * Creates a permission repository using the provided repository implementation.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<Permission, CreatePermissionData, UpdatePermissionData, number>,
        ...args: unknown[]
    ) {
        super(repositoryClass, PermissionRepository.TABLE_NAME, PermissionRepository.MODEL, ...args);
    }

    /** Updates one permission and maps operation identifiers to the Prisma relation format. */
    public async update(id: number, data: UpdatePermissionData, args?: RepositoryQueryArgs): Promise<Permission> {
        const { operations, ...permissionData } = data;
        const updateData: Record<string, unknown> = { ...permissionData };

        if (operations !== undefined) {
            updateData.operations = {
                set: operations.map((operationId) => ({ id: operationId })),
            };
        }

        return await super.update(id, updateData as UpdatePermissionData, args);
    }
}
