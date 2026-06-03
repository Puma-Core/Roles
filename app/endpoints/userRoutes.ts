import { Role } from "../domains/roles";
import { UpdateRoleData } from "../infraestructure/roleRepository";
import { RoleService } from "../services/roleService";

/**
 * Use case layer for role API operations.
 *
 * Maps the role API actions to the role service without depending on an HTTP framework.
 *
 * @public
 */
export class RoleUseCase {
    /**
     * Creates the role use case.
     *
     * @param roleService - Service used to execute role operations.
     */
    public constructor(private readonly roleService: RoleService) {
        this.roleService = roleService;
    }

    /** Handles GET /api/roles. */
    public getRoles(): Promise<Role[]> {
        return this.roleService.getAll();
    }

    /** Handles PUT /api/roles/{id}. */
    public updateRole(id: string, data: UpdateRoleData): Promise<Role> {
        return this.roleService.update(id, data);
    }

    /** Handles DELETE /api/roles/{id}. */
    public deleteRole(id: string): Promise<void> {
        return this.roleService.delete(id);
    }
}
