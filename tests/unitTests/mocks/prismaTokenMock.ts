import { mock, MockProxy } from 'jest-mock-extended';
import { PrismaModel } from '../../../app/infraestructure/prisma/prismaRepository';
import { Token } from '../../../app/domains/tokens';
import { CreateTokenData, UpdateTokenData } from '../../../app/infraestructure/tokenRepository';

type TokenPrismaModel = PrismaModel<Token, CreateTokenData, UpdateTokenData, number>;
export type MockTokenPrismaModel = MockProxy<TokenPrismaModel>;

export interface MockTokenPrismaClient {
    Token: MockTokenPrismaModel;
}

export function createMockTokenPrismaClient(): MockTokenPrismaClient {
    return {
        Token: mock<TokenPrismaModel>(),
    };
}
