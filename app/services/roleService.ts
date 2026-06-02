import { CreateRoleData, RoleRepository, UpdateRoleData } from "../infraestructure/roleRepository";
import { Role } from "../domains/roles";

/**
 * Service layer for role use cases.
 *
 * This service depends on RoleRepository and does not know which ORM or database driver is used.
 *
 * @public
 */
export class RoleService {
    /**
     * Creates the role service.
     *
     * @param roleRepository - Repository used to access role data.
     */
    public constructor(private readonly roleRepository: RoleRepository) {
        this.roleRepository = roleRepository;
    }

    /** Gets one role by its identifier. */
    public getById(id: string): Promise<Role | null> {
        return this.roleRepository.getById(id);
    }

    /** Gets all roles. */
    public getAll(): Promise<Role[]> {
        return this.roleRepository.getAll();
    }

    /** Creates one role. */
    public create(data: CreateRoleData): Promise<Role> {
        return this.roleRepository.create(data);
    }

    /** Updates one role by its identifier. */
    public update(id: string, data: UpdateRoleData): Promise<Role> {
        return this.roleRepository.update(id, data);
    }

    /** Deletes one role by its identifier. */
    public delete(id: string): Promise<void> {
        return this.roleRepository.delete(id);
    }
}
