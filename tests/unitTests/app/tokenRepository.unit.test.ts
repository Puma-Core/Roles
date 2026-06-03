import { TokenRepository, CreateTokenData } from '../../../app/infraestructure/tokenRepository';
import { PrismaRepository } from '../../../app/infraestructure/prisma/prismaRepository';
import { createMockTokenPrismaClient, MockTokenPrismaClient } from '../mocks/prismaTokenMock';
import { Token } from '../../../app/domains/tokens';
import { TokenValues } from '../../../app/domains/interfaces/tokens';

const baseTokenData = (overrides: Partial<TokenValues> = {}): TokenValues => ({
    id: 1,
    name: 'access-token',
    value: 'eyJhbGciOiJIUzI1NiIs...',
    createdAt: new Date('2025-01-01'),
    expireAt: new Date('2025-06-01'),
    userId: 1,
    ...overrides,
});

describe('TokenRepository', () => {
    let prisma: MockTokenPrismaClient;
    let tokenRepository: TokenRepository;

    beforeEach(() => {
        prisma = createMockTokenPrismaClient();
        tokenRepository = new TokenRepository(PrismaRepository, prisma);
    });

    describe('getById', () => {
        it('returns a Token instance when found', async () => {
            const data = baseTokenData();
            prisma.Token.findUnique.mockResolvedValue(data);

            const result = await tokenRepository.getById(1);

            expect(result).toBeInstanceOf(Token);
            expect(result).toEqual(new Token(data));
            expect(prisma.Token.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('returns null when not found', async () => {
            prisma.Token.findUnique.mockResolvedValue(null);

            const result = await tokenRepository.getById(999);

            expect(result).toBeNull();
        });

        it('passes query args to Prisma', async () => {
            prisma.Token.findUnique.mockResolvedValue(baseTokenData());
            const args = { include: { user: true } };

            await tokenRepository.getById(1, args);

            expect(prisma.Token.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, ...args });
        });
    });

    describe('getBy', () => {
        it('returns a Token instance matching the criteria', async () => {
            const data = baseTokenData({ name: 'refresh-token' });
            prisma.Token.findFirst.mockResolvedValue(data);

            const result = await tokenRepository.getBy({ name: 'refresh-token' });

            expect(result).toBeInstanceOf(Token);
            expect(result).toEqual(new Token(data));
            expect(prisma.Token.findFirst).toHaveBeenCalledWith({ where: { name: 'refresh-token' } });
        });

        it('returns null when no match', async () => {
            prisma.Token.findFirst.mockResolvedValue(null);

            const result = await tokenRepository.getBy({ name: 'nonexistent' });

            expect(result).toBeNull();
        });
    });

    describe('getAll', () => {
        it('returns an array of Token instances', async () => {
            const data = [
                baseTokenData({ id: 1, name: 'access-token' }),
                baseTokenData({ id: 2, name: 'refresh-token' }),
            ];
            prisma.Token.findMany.mockResolvedValue(data);

            const result = await tokenRepository.getAll();

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Token);
            expect(result[0].name).toBe('access-token');
            expect(result[1].name).toBe('refresh-token');
        });

        it('returns an empty array when no tokens exist', async () => {
            prisma.Token.findMany.mockResolvedValue([]);

            const result = await tokenRepository.getAll();

            expect(result).toEqual([]);
        });

        it('passes query args to Prisma', async () => {
            prisma.Token.findMany.mockResolvedValue([]);
            const args = { orderBy: { name: 'asc' as const } };

            await tokenRepository.getAll(args);

            expect(prisma.Token.findMany).toHaveBeenCalledWith(args);
        });
    });

    describe('create', () => {
        it('creates and returns a Token instance', async () => {
            const expireAt = new Date('2025-12-31');
            const createData: CreateTokenData = {
                name: 'session-token',
                value: 'abc123',
                expireAt,
                userId: 2,
            };
            const createdData = baseTokenData({
                id: 10,
                name: 'session-token',
                value: 'abc123',
                expireAt,
                userId: 2,
            });
            prisma.Token.create.mockResolvedValue(createdData);

            const result = await tokenRepository.create(createData);

            expect(result).toBeInstanceOf(Token);
            expect(result.id).toBe(10);
            expect(result.name).toBe('session-token');
            expect(prisma.Token.create).toHaveBeenCalledWith({ data: createData });
        });
    });

    describe('update', () => {
        it('updates fields and returns a Token instance', async () => {
            const updatedData = baseTokenData({ name: 'updated-token' });
            prisma.Token.update.mockResolvedValue(updatedData);

            const result = await tokenRepository.update(1, { name: 'updated-token' });

            expect(result).toBeInstanceOf(Token);
            expect(result.name).toBe('updated-token');
            expect(prisma.Token.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'updated-token' },
            });
        });

        it('passes query args to Prisma', async () => {
            const updatedData = baseTokenData({ name: 'Renamed' });
            prisma.Token.update.mockResolvedValue(updatedData);
            const args = { include: { user: true } };

            await tokenRepository.update(1, { name: 'Renamed' }, args);

            expect(prisma.Token.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'Renamed' },
                ...args,
            });
        });
    });

    describe('delete', () => {
        it('deletes a token by id', async () => {
            prisma.Token.delete.mockResolvedValue(baseTokenData());

            await tokenRepository.delete(1);

            expect(prisma.Token.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
