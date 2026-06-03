import { BaseRepository, RepositoryConstructor } from "./baseRepository";
import { Role } from "../domains/roles";
import { RoleValues } from "../domains/interfaces/roles";
import { RepositoryQueryArgs } from "./interfaces/repository";

/** Data required to create a role. */
export type CreateRoleData = Omit<RoleValues, "id" | "permissions" | "users">;

/** Data allowed to update a role. */
export type UpdateRoleData = Partial<CreateRoleData> & { permissions?: number[] };

/**
 * Role repository bound to the role domain model.
 *
 * The concrete storage implementation is provided through the constructor, so this repository
 * does not need to know which ORM or database driver is being used.
 *
 * @public
 */
export class RoleRepository extends BaseRepository<Role, CreateRoleData, UpdateRoleData, number> {
    /** Prisma model name used by the concrete repository implementation. */
    public static readonly TABLE_NAME = "roles";
    public static readonly MODEL = Role;

    /**
     * Creates a role repository using the provided repository implementation.
     *
     * @param repositoryClass - Repository implementation class to instantiate.
     * @param args - Arguments passed to the repository implementation constructor.
     */
    public constructor(
        repositoryClass: RepositoryConstructor<Role, CreateRoleData, UpdateRoleData, number>,
        ...args: unknown[]
    ) {
        super(repositoryClass, RoleRepository.TABLE_NAME, RoleRepository.MODEL, ...args);
    }

    /** Updates one role and maps permission identifiers to the role-permission relation format. */
    public async update(id: number, data: UpdateRoleData, args?: RepositoryQueryArgs): Promise<Role> {
        const { permissions, ...roleData } = data;
        const updateData: Record<string, unknown> = { ...roleData };

        if (permissions !== undefined) {
            updateData.rolePermissions = {
                deleteMany: {},
                create: permissions.map((permissionId) => ({
                    permission: {
                        connect: { id: permissionId },
                    },
                })),
            };
        }

        return await super.update(id, updateData as UpdateRoleData, args);
    }
}
