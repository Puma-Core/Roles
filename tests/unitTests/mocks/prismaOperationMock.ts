import { mock, MockProxy } from 'jest-mock-extended';
import { PrismaModel } from '../../../app/infraestructure/prisma/prismaRepository';
import { Operation } from '../../../app/domains/operations';
import { CreateOperationData, UpdateOperationData } from '../../../app/infraestructure/operationRepository';

type OperationPrismaModel = PrismaModel<Operation, CreateOperationData, UpdateOperationData, number>;
export type MockOperationPrismaModel = MockProxy<OperationPrismaModel>;

export interface MockOperationPrismaClient {
    Operation: MockOperationPrismaModel;
}

export function createMockOperationPrismaClient(): MockOperationPrismaClient {
    return {
        Operation: mock<OperationPrismaModel>(),
    };
}
