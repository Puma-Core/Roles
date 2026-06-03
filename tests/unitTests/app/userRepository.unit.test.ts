import { UserRepository, CreateUserData } from '../../../app/infraestructure/userRepository';
import { PrismaRepository } from '../../../app/infraestructure/prisma/prismaRepository';
import { createMockUserPrismaClient, MockUserPrismaClient } from '../mocks/prismaUserMock';
import { User } from '../../../app/domains/users';
import { UserValues } from '../../../app/domains/interfaces/users';

const baseUserData = (overrides: Partial<UserValues> = {}): User => ({
    id: 1,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-02'),
    username: 'jdoe',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashed_password',
    age: 30,
    nationality: 'US',
    roles: [],
    tokens: [],
    isValidPassword: async () => true,
    ...overrides,
});

describe('UserRepository', () => {
    let prisma: MockUserPrismaClient;
    let userRepository: UserRepository;

    beforeEach(() => {
        prisma = createMockUserPrismaClient();
        userRepository = new UserRepository(PrismaRepository, prisma);
    });

    describe('getById', () => {
        it('returns a User instance when found', async () => {
            const data = baseUserData();
            prisma.User.findUnique.mockResolvedValue(data);

            const result = await userRepository.getById(1);

            expect(result).toBeInstanceOf(User);
            expect(result).toEqual(new User(data));
            expect(prisma.User.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('returns null when not found', async () => {
            prisma.User.findUnique.mockResolvedValue(null);

            const result = await userRepository.getById(999);

            expect(result).toBeNull();
        });

        it('passes query args to Prisma', async () => {
            prisma.User.findUnique.mockResolvedValue(baseUserData());
            const args = { include: { roles: true } };

            await userRepository.getById(1, args);

            expect(prisma.User.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, ...args });
        });
    });

    describe('getBy', () => {
        it('returns a User instance matching the criteria', async () => {
            const data = baseUserData({ username: 'jdoe' });
            prisma.User.findFirst.mockResolvedValue(data);

            const result = await userRepository.getBy({ username: 'jdoe' });

            expect(result).toBeInstanceOf(User);
            expect(result).toEqual(new User(data));
            expect(prisma.User.findFirst).toHaveBeenCalledWith({ where: { username: 'jdoe' } });
        });

        it('returns null when no match', async () => {
            prisma.User.findFirst.mockResolvedValue(null);

            const result = await userRepository.getBy({ username: 'nobody' });

            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('returns an array of User instances', async () => {
            const data = [
                baseUserData({ id: 1, username: 'jdoe' }),
                baseUserData({ id: 2, username: 'asmith' }),
            ];
            prisma.User.findMany.mockResolvedValue(data);

            const result = await userRepository.getAll();

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(User);
            expect(result[0].username).toBe('jdoe');
            expect(result[1].username).toBe('asmith');
        });

        it('returns an empty array when no users exist', async () => {
            prisma.User.findMany.mockResolvedValue([]);

            const result = await userRepository.getAll();

            expect(result).toEqual([]);
        });

        it('passes query args to Prisma', async () => {
            prisma.User.findMany.mockResolvedValue([]);
            const args = { orderBy: { username: 'asc' as const } };

            await userRepository.getAll(args);

            expect(prisma.User.findMany).toHaveBeenCalledWith(args);
        });
    });

    describe('create', () => {
        it('creates and returns a User instance', async () => {
            const createData: CreateUserData = {
                username: 'newuser',
                firstName: 'New',
                lastName: 'User',
                password: 'plain_password',
                age: 25,
                nationality: 'MX',
            };
            const createdData = baseUserData({ id: 5, username: 'newuser', firstName: 'New', lastName: 'User', password: 'plain_password', age: 25, nationality: 'MX' });
            prisma.User.create.mockResolvedValue(createdData);

            const result = await userRepository.create(createData);

            expect(result).toBeInstanceOf(User);
            expect(result.id).toBe(5);
            expect(result.username).toBe('newuser');
            expect(prisma.User.create).toHaveBeenCalledWith({ data: createData });
        });
    });

    describe('update', () => {
        it('updates fields and returns a User instance', async () => {
            const updatedData = baseUserData({ firstName: 'Jonathan' });
            prisma.User.update.mockResolvedValue(updatedData);

            const result = await userRepository.update(1, { firstName: 'Jonathan' });

            expect(result).toBeInstanceOf(User);
            expect(result.firstName).toBe('Jonathan');
            expect(prisma.User.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { firstName: 'Jonathan' },
            });
        });

        it('transforms roles into Prisma set relation format', async () => {
            const updatedData = baseUserData();
            prisma.User.update.mockResolvedValue(updatedData);

            await userRepository.update(1, { roles: [10, 20] });

            expect(prisma.User.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    roles: {
                        set: [{ id: 10 }, { id: 20 }],
                    },
                },
            });
        });

        it('preserves other fields when updating with roles', async () => {
            const updatedData = baseUserData({ firstName: 'Updated', nationality: 'CA' });
            prisma.User.update.mockResolvedValue(updatedData);

            await userRepository.update(1, { firstName: 'Updated', nationality: 'CA', roles: [5] });

            expect(prisma.User.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    firstName: 'Updated',
                    nationality: 'CA',
                    roles: {
                        set: [{ id: 5 }],
                    },
                },
            });
        });

        it('passes query args to Prisma', async () => {
            const updatedData = baseUserData({ firstName: 'Renamed' });
            prisma.User.update.mockResolvedValue(updatedData);
            const args = { include: { roles: true } };

            await userRepository.update(1, { firstName: 'Renamed' }, args);

            expect(prisma.User.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { firstName: 'Renamed' },
                ...args,
            });
        });
    });

    describe('delete', () => {
        it('deletes a user by id', async () => {
            prisma.User.delete.mockResolvedValue(baseUserData());

            await userRepository.delete(1);

            expect(prisma.User.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
