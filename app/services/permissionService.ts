import {
    CreatePermissionData,
    PermissionRepository,
    UpdatePermissionData,
} from "../infraestructure/permissionRepository";
import { Permission } from "../domains/permissions";

/**
 * Service layer for permission use cases.
 *
 * This service depends on PermissionRepository and does not know which ORM or database driver is used.
 *
 * @public
 */
export class PermissionService {
    /**
     * Creates the permission service.
     *
     * @param permissionRepository - Repository used to access permission data.
     */
    public constructor(private readonly permissionRepository: PermissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    /** Gets one permission by its identifier. */
    public getById(id: number): Promise<Permission | null> {
        return this.permissionRepository.getById(id);
    }

    /** Gets all permissions. */
    public getAll(): Promise<Permission[]> {
        return this.permissionRepository.getAll();
    }

    /** Creates one permission. */
    public create(data: CreatePermissionData): Promise<Permission> {
        return this.permissionRepository.create(data);
    }

    /** Updates one permission by its identifier. */
    public update(id: number, data: UpdatePermissionData): Promise<Permission> {
        return this.permissionRepository.update(id, data);
    }

    /** Deletes one permission by its identifier. */
    public delete(id: number): Promise<void> {
        return this.permissionRepository.delete(id);
    }
}
