import { PermissionRepository, CreatePermissionData } from '../../../app/infraestructure/permissionRepository';
import { PrismaRepository } from '../../../app/infraestructure/prisma/prismaRepository';
import { createMockPermissionPrismaClient, MockPermissionPrismaClient } from '../mocks/prismaPermissionMock';
import { Permission } from '../../../app/domains/permissions';
import { PermissionAccessScope, PermissionValues } from '../../../app/domains/interfaces/permissions';
import { Operation } from '../../../app/domains/operations';

const basePermissionData = (overrides: Partial<PermissionValues> = {}): Permission => ({
    id: 1,
    name: 'users-read',
    scope: 'API' as PermissionAccessScope,
    operations: [] as Operation[],
    rolePermissions: [],
    ...overrides,
});

describe('PermissionRepository', () => {
    let prisma: MockPermissionPrismaClient;
    let permissionRepository: PermissionRepository;

    beforeEach(() => {
        prisma = createMockPermissionPrismaClient();
        permissionRepository = new PermissionRepository(PrismaRepository, prisma);
    });

    describe('getById', () => {
        it('returns a Permission instance when found', async () => {
            const data = basePermissionData();
            prisma.Permission.findUnique.mockResolvedValue(data);

            const result = await permissionRepository.getById(1);

            expect(result).toBeInstanceOf(Permission);
            expect(result).toEqual(new Permission(data));
            expect(prisma.Permission.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('returns null when not found', async () => {
            prisma.Permission.findUnique.mockResolvedValue(null);

            const result = await permissionRepository.getById(999);

            expect(result).toBeNull();
        });

        it('passes query args to Prisma', async () => {
            prisma.Permission.findUnique.mockResolvedValue(basePermissionData());
            const args = { include: { operations: true } };

            await permissionRepository.getById(1, args);

            expect(prisma.Permission.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, ...args });
        });
    });

    describe('getBy', () => {
        it('returns a Permission instance matching the criteria', async () => {
            const data = basePermissionData({ name: 'users-read' });
            prisma.Permission.findFirst.mockResolvedValue(data);

            const result = await permissionRepository.getBy({ name: 'users-read' });

            expect(result).toBeInstanceOf(Permission);
            expect(result).toEqual(new Permission(data));
            expect(prisma.Permission.findFirst).toHaveBeenCalledWith({ where: { name: 'users-read' } });
        });

        it('returns null when no match', async () => {
            prisma.Permission.findFirst.mockResolvedValue(null);

            const result = await permissionRepository.getBy({ name: 'nonexistent' });

            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('returns an array of Permission instances', async () => {
            const data = [
                basePermissionData({ id: 1, name: 'users-read' }),
                basePermissionData({ id: 2, name: 'users-write' }),
            ];
            prisma.Permission.findMany.mockResolvedValue(data);

            const result = await permissionRepository.getAll();

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Permission);
            expect(result[0].name).toBe('users-read');
            expect(result[1].name).toBe('users-write');
        });

        it('returns an empty array when no permissions exist', async () => {
            prisma.Permission.findMany.mockResolvedValue([]);

            const result = await permissionRepository.getAll();

            expect(result).toEqual([]);
        });

        it('passes query args to Prisma', async () => {
            prisma.Permission.findMany.mockResolvedValue([]);
            const args = { orderBy: { name: 'asc' as const } };

            await permissionRepository.getAll(args);

            expect(prisma.Permission.findMany).toHaveBeenCalledWith(args);
        });
    });

    describe('create', () => {
        it('creates and returns a Permission instance', async () => {
            const createData: CreatePermissionData = { name: 'roles-manage', scope: 'ADMIN' };
            const createdData = basePermissionData({ id: 10, name: 'roles-manage', scope: 'ADMIN' });
            prisma.Permission.create.mockResolvedValue(createdData);

            const result = await permissionRepository.create(createData);

            expect(result).toBeInstanceOf(Permission);
            expect(result.id).toBe(10);
            expect(result.name).toBe('roles-manage');
            expect(prisma.Permission.create).toHaveBeenCalledWith({ data: createData });
        });
    });

    describe('update', () => {
        it('updates fields and returns a Permission instance', async () => {
            const updatedData = basePermissionData({ name: 'users-full', scope: 'ALL' });
            prisma.Permission.update.mockResolvedValue(updatedData);

            const result = await permissionRepository.update(1, { name: 'users-full' });

            expect(result).toBeInstanceOf(Permission);
            expect(result.name).toBe('users-full');
            expect(prisma.Permission.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'users-full' },
            });
        });

        it('transforms operations into Prisma set relation format', async () => {
            const updatedData = basePermissionData();
            prisma.Permission.update.mockResolvedValue(updatedData);

            await permissionRepository.update(1, { operations: [10, 20] });

            expect(prisma.Permission.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    operations: {
                        set: [{ id: 10 }, { id: 20 }],
                    },
                },
            });
        });

        it('preserves other fields when updating with operations', async () => {
            const updatedData = basePermissionData({ name: 'updated', scope: 'ALL' });
            prisma.Permission.update.mockResolvedValue(updatedData);

            await permissionRepository.update(1, { name: 'updated', scope: 'ALL', operations: [5] });

            expect(prisma.Permission.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: 'updated',
                    scope: 'ALL',
                    operations: {
                        set: [{ id: 5 }],
                    },
                },
            });
        });

        it('passes query args to Prisma', async () => {
            const updatedData = basePermissionData({ name: 'Renamed' });
            prisma.Permission.update.mockResolvedValue(updatedData);
            const args = { include: { operations: true } };

            await permissionRepository.update(1, { name: 'Renamed' }, args);

            expect(prisma.Permission.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'Renamed' },
                ...args,
            });
        });
    });

    describe('delete', () => {
        it('deletes a permission by id', async () => {
            prisma.Permission.delete.mockResolvedValue(basePermissionData());

            await permissionRepository.delete(1);

            expect(prisma.Permission.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
