import { OperationRepository, CreateOperationData } from '../../../app/infraestructure/operationRepository';
import { PrismaRepository } from '../../../app/infraestructure/prisma/prismaRepository';
import { createMockOperationPrismaClient, MockOperationPrismaClient } from '../mocks/prismaOperationMock';
import { Operation } from '../../../app/domains/operations';
import { OperationType, OperationValues } from '../../../app/domains/interfaces/operations';

const baseOperationData = (overrides: Partial<OperationValues> = {}): OperationValues => ({
    id: 1,
    label: 'Create User',
    name: 'create-user',
    tool: 'users',
    operation: ['CREATE'] as OperationType[],
    permissionId: 1,
    ...overrides,
});

describe('OperationRepository', () => {
    let prisma: MockOperationPrismaClient;
    let operationRepository: OperationRepository;

    beforeEach(() => {
        prisma = createMockOperationPrismaClient();
        operationRepository = new OperationRepository(PrismaRepository, prisma);
    });

    describe('getById', () => {
        it('returns an Operation instance when found', async () => {
            const data = baseOperationData();
            prisma.Operation.findUnique.mockResolvedValue(data);

            const result = await operationRepository.getById(1);

            expect(result).toBeInstanceOf(Operation);
            expect(result).toEqual(new Operation(data));
            expect(prisma.Operation.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('returns null when not found', async () => {
            prisma.Operation.findUnique.mockResolvedValue(null);

            const result = await operationRepository.getById(999);

            expect(result).toBeNull();
        });

        it('passes query args to Prisma', async () => {
            prisma.Operation.findUnique.mockResolvedValue(baseOperationData());
            const args = { include: { permission: true } };

            await operationRepository.getById(1, args);

            expect(prisma.Operation.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, ...args });
        });
    });

    describe('getBy', () => {
        it('returns an Operation instance matching the criteria', async () => {
            const data = baseOperationData({ name: 'create-user' });
            prisma.Operation.findFirst.mockResolvedValue(data);

            const result = await operationRepository.getBy({ name: 'create-user' });

            expect(result).toBeInstanceOf(Operation);
            expect(result).toEqual(new Operation(data));
            expect(prisma.Operation.findFirst).toHaveBeenCalledWith({ where: { name: 'create-user' } });
        });

        it('returns null when no match', async () => {
            prisma.Operation.findFirst.mockResolvedValue(null);

            const result = await operationRepository.getBy({ name: 'nonexistent' });

            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('returns an array of Operation instances', async () => {
            const data: OperationValues[] = [
                { id: 1, label: 'Create User', name: 'create-user', tool: 'users', operation: ['CREATE'] as OperationType[], permissionId: 1 },
                { id: 2, label: 'Read User', name: 'read-user', tool: 'users', operation: ['READ'] as OperationType[], permissionId: 1 },
            ];
            prisma.Operation.findMany.mockResolvedValue(data);

            const result = await operationRepository.getAll();

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Operation);
            expect(result[0].name).toBe('create-user');
            expect(result[1].name).toBe('read-user');
        });

        it('returns an empty array when no operations exist', async () => {
            prisma.Operation.findMany.mockResolvedValue([]);

            const result = await operationRepository.getAll();

            expect(result).toEqual([]);
        });

        it('passes query args to Prisma', async () => {
            prisma.Operation.findMany.mockResolvedValue([]);
            const args = { orderBy: { name: 'asc' as const } };

            await operationRepository.getAll(args);

            expect(prisma.Operation.findMany).toHaveBeenCalledWith(args);
        });
    });

    describe('create', () => {
        it('creates and returns an Operation instance', async () => {
            const createData: CreateOperationData = {
                label: 'Delete User',
                name: 'delete-user',
                tool: 'users',
                operation: ['DELETE'] as OperationType[],
                permissionId: 2,
            };
            const createdData = baseOperationData({ id: 3, name: 'delete-user', label: 'Delete User', operation: ['DELETE'] as OperationType[], permissionId: 2 });
            prisma.Operation.create.mockResolvedValue(createdData);

            const result = await operationRepository.create(createData);

            expect(result).toBeInstanceOf(Operation);
            expect(result.id).toBe(3);
            expect(result.name).toBe('delete-user');
            expect(prisma.Operation.create).toHaveBeenCalledWith({ data: createData });
        });
    });

    describe('update', () => {
        it('updates fields and returns an Operation instance', async () => {
            const updatedData = baseOperationData({ label: 'Updated', name: 'updated-op', operation: ['READ', 'UPDATE'] as OperationType[] });
            prisma.Operation.update.mockResolvedValue(updatedData);

            const result = await operationRepository.update(1, { label: 'Updated' });

            expect(result).toBeInstanceOf(Operation);
            expect(result.label).toBe('Updated');
            expect(prisma.Operation.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { label: 'Updated' },
            });
        });

        it('passes query args to Prisma', async () => {
            const updatedData = baseOperationData({ label: 'Test', name: 'test', tool: 'x', operation: ['CREATE'] as OperationType[] });
            prisma.Operation.update.mockResolvedValue(updatedData);
            const args = { include: { permission: true } };

            await operationRepository.update(1, { label: 'Test' }, args);

            expect(prisma.Operation.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { label: 'Test' },
                ...args,
            });
        });
    });

    describe('delete', () => {
        it('deletes an operation by id', async () => {
            prisma.Operation.delete.mockResolvedValue(baseOperationData());

            await operationRepository.delete(1);

            expect(prisma.Operation.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
