import { BaseRepository, RepositoryConstructor } from "./baseRepository";
import { Permission } from "../domains/permissions";
import { PermissionValues } from "../domains/interfaces/permissions";

/** Data required to create a permission. */
export type CreatePermissionData = PermissionValues;

/** Data allowed to update a permission. */
export type UpdatePermissionData = Partial<PermissionValues>;

/**
 * Permission repository bound to the permission domain model.
 *
 * The concrete storage implementation is provided through the constructor, so this repository
 * does not need to know which ORM or database driver is being used.
 *
 * @public
 */
export class PermissionRepository extends BaseRepository<Permission, CreatePermissionData, UpdatePermissionData, string> {
    /** Prisma model name used by the concrete repository implementation. */
    public static readonly TABLE_NAME = "permission";

    /**
     * Creates a permission repository using the provided repository implementation.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<Permission, CreatePermissionData, UpdatePermissionData, string>,
        ...args: unknown[]
    ) {
        super(repositoryClass, PermissionRepository.TABLE_NAME, ...args);
    }
}
