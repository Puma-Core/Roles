import { RoleRepository, CreateRoleData } from '../../../app/infraestructure/roleRepository';
import { PrismaRepository } from '../../../app/infraestructure/prisma/prismaRepository';
import { createMockPrismaClient, MockPrismaClient } from '../mocks/prismaMock';
import { Role } from '../../../app/domains/roles';
import { RoleValues } from '../../../app/domains/interfaces/roles';
import { Permission } from '../../../app/domains/permissions';
import { User } from '../../../app/domains/users';

const baseRoleData = (overrides: Partial<RoleValues> = {}): RoleValues => ({
    id: 1,
    name: 'Admin',
    scope: 'API',
    permissions: [] as Permission[],
    users: [] as User[],
    ...overrides,
});

describe('RoleRepository', () => {
    let prisma: MockPrismaClient;
    let roleRepository: RoleRepository;

    beforeEach(() => {
        prisma = createMockPrismaClient();
        roleRepository = new RoleRepository(PrismaRepository, prisma);
    });

    describe('getById', () => {
        it('returns a Role instance when the role exists', async () => {
            const data = baseRoleData();
            prisma.roles.findUnique.mockResolvedValue(data);

            const result = await roleRepository.getById(1);

            expect(result).toBeInstanceOf(Role);
            expect(result).toEqual(new Role(data));
            expect(prisma.roles.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('returns null when the role does not exist', async () => {
            prisma.roles.findUnique.mockResolvedValue(null);

            const result = await roleRepository.getById(999);

            expect(result).toBeNull();
        });

        it('passes query args to Prisma', async () => {
            prisma.roles.findUnique.mockResolvedValue(baseRoleData());
            const args = { include: { permissions: true } };

            await roleRepository.getById(1, args);

            expect(prisma.roles.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                ...args,
            });
        });
    });

    describe('getBy', () => {
        it('returns a Role instance matching the criteria', async () => {
            const data = baseRoleData({ name: 'Admin' });
            prisma.roles.findFirst.mockResolvedValue(data);

            const result = await roleRepository.getBy({ name: 'Admin' });

            expect(result).toBeInstanceOf(Role);
            expect(result).toEqual(new Role(data));
            expect(prisma.roles.findFirst).toHaveBeenCalledWith({ where: { name: 'Admin' } });
        });

        it('returns null when no role matches', async () => {
            prisma.roles.findFirst.mockResolvedValue(null);

            const result = await roleRepository.getBy({ name: 'NonExistent' });

            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('returns an array of Role instances', async () => {
            prisma.roles.findMany.mockResolvedValue([
                new Role({ id: 1, name: 'Admin', scope: 'API', permissions: [], users: [] }),
                new Role({ id: 2, name: 'User', scope: 'API', permissions: [], users: [] }),
            ]);

            const result = await roleRepository.getAll();

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Role);
            expect(result[0].name).toBe('Admin');
            expect(result[1].name).toBe('User');
        });

        it('returns an empty array when no roles exist', async () => {
            prisma.roles.findMany.mockResolvedValue([]);

            const result = await roleRepository.getAll();

            expect(result).toEqual([]);
        });

        it('passes query args to Prisma', async () => {
            prisma.roles.findMany.mockResolvedValue([]);
            const args = { orderBy: { name: 'asc' as const } };

            await roleRepository.getAll(args);

            expect(prisma.roles.findMany).toHaveBeenCalledWith(args);
        });
    });

    describe('create', () => {
        it('creates and returns a Role instance', async () => {
            const createData: CreateRoleData = { name: 'Manager', scope: 'API' };
            const createdData = baseRoleData({ id: 3, name: 'Manager' });
            prisma.roles.create.mockResolvedValue(createdData);

            const result = await roleRepository.create(createData);

            expect(result).toBeInstanceOf(Role);
            expect(result.id).toBe(3);
            expect(result.name).toBe('Manager');
            expect(prisma.roles.create).toHaveBeenCalledWith({ data: createData });
        });
    });

    describe('update', () => {
        it('updates role fields and returns a Role instance', async () => {
            const updatedData = baseRoleData({ name: 'Super Admin' });
            prisma.roles.update.mockResolvedValue(updatedData);

            const result = await roleRepository.update(1, { name: 'Super Admin' });

            expect(result).toBeInstanceOf(Role);
            expect(result.name).toBe('Super Admin');
            expect(prisma.roles.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'Super Admin' },
            });
        });

        it('transforms permissions into rolePermissions relation format', async () => {
            const updatedData = baseRoleData();
            prisma.roles.update.mockResolvedValue(updatedData);

            await roleRepository.update(1, { permissions: [10, 20] });

            expect(prisma.roles.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    rolePermissions: {
                        deleteMany: {},
                        create: [
                            { permission: { connect: { id: 10 } } },
                            { permission: { connect: { id: 20 } } },
                        ],
                    },
                },
            });
        });

        it('preserves other fields when updating with permissions', async () => {
            const updatedData = baseRoleData({ name: 'Admin', scope: 'ADMIN' });
            prisma.roles.update.mockResolvedValue(updatedData);

            await roleRepository.update(1, { name: 'Updated Role', scope: 'ALL', permissions: [5] });

            expect(prisma.roles.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: 'Updated Role',
                    scope: 'ALL',
                    rolePermissions: {
                        deleteMany: {},
                        create: [{ permission: { connect: { id: 5 } } }],
                    },
                },
            });
        });

        it('passes query args to Prisma', async () => {
            const updatedData = baseRoleData();
            prisma.roles.update.mockResolvedValue(updatedData);
            const args = { include: { permissions: true } };

            await roleRepository.update(1, { name: 'Renamed' }, args);

            expect(prisma.roles.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'Renamed' },
                ...args,
            });
        });
    });

    describe('delete', () => {
        it('deletes a role by id', async () => {
            prisma.roles.delete.mockResolvedValue(baseRoleData());

            await roleRepository.delete(1);

            expect(prisma.roles.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
