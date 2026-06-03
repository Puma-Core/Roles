import { RoleService } from '../../../app/services/roleService';
import { Role } from '../../../app/domains/roles';
import { RoleRepository } from '../../../app/infraestructure/roleRepository';
import { createMockRoleRepository, MockRoleRepository } from '../mocks/roleRepositoryMock';

describe('RoleService', () => {
  let mockRepo: MockRoleRepository;
  let service: RoleService;

  beforeEach(() => {
    mockRepo = createMockRoleRepository();
    service = new RoleService(mockRepo as unknown as RoleRepository);
  });

  describe('getById', () => {
    it('returns a role when found', async () => {
      const role = new Role({ id: 1, name: 'Admin', scope: 'API' });
      mockRepo.getById.mockResolvedValue(role);

      const result = await service.getById(1);

      expect(result).toBe(role);
      expect(mockRepo.getById).toHaveBeenCalledWith(1, undefined);
    });

    it('returns null when role is not found', async () => {
      mockRepo.getById.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
      expect(mockRepo.getById).toHaveBeenCalledWith(999, undefined);
    });

    it('passes query args to the repository', async () => {
      mockRepo.getById.mockResolvedValue(null);
      const args = { include: { permissions: true } };

      await service.getById(1, args);

      expect(mockRepo.getById).toHaveBeenCalledWith(1, args);
    });
  });

  describe('getAll', () => {
    it('returns all roles', async () => {
      const roles = [
        new Role({ id: 1, name: 'Admin', scope: 'API' }),
        new Role({ id: 2, name: 'User', scope: 'API' }),
      ];
      mockRepo.getAll.mockResolvedValue(roles);

      const result = await service.getAll();

      expect(result).toEqual(roles);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when no roles exist', async () => {
      mockRepo.getAll.mockResolvedValue([]);

      const result = await service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('creates and returns a new role', async () => {
      const createData = { name: 'Manager', scope: 'API' as const };
      const createdRole = new Role({ id: 3, ...createData });
      mockRepo.create.mockResolvedValue(createdRole);

      const result = await service.create(createData);

      expect(result).toEqual(createdRole);
      expect(mockRepo.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('update', () => {
    it('updates and returns the role', async () => {
      const updateData = { name: 'Super Admin' };
      const updatedRole = new Role({ id: 1, name: 'Super Admin', scope: 'API' });
      mockRepo.update.mockResolvedValue(updatedRole);

      const result = await service.update(1, updateData);

      expect(result).toEqual(updatedRole);
      expect(mockRepo.update).toHaveBeenCalledWith(1, updateData, undefined);
    });

    it('passes query args to the repository', async () => {
      const updateData = { name: 'Updated' };
      const args = { include: { permissions: true } };
      mockRepo.update.mockResolvedValue(new Role({ id: 1, name: 'Updated', scope: 'API' }));

      await service.update(1, updateData, args);

      expect(mockRepo.update).toHaveBeenCalledWith(1, updateData, args);
    });
  });

  describe('delete', () => {
    it('deletes a role by id', async () => {
      mockRepo.delete.mockResolvedValue(undefined);

      await service.delete(1);

      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
