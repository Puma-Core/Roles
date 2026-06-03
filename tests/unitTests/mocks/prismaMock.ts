import { mock, MockProxy } from 'jest-mock-extended';
import { PrismaModel } from '../../../app/infraestructure/prisma/prismaRepository';
import { Role } from '../../../app/domains/roles';
import { CreateRoleData, UpdateRoleData } from '../../../app/infraestructure/roleRepository';

type RolesPrismaModel = PrismaModel<Role, CreateRoleData, UpdateRoleData, number>;
export type MockRolesPrismaModel = MockProxy<RolesPrismaModel>;

export interface MockPrismaClient {
    roles: MockRolesPrismaModel;
}

export function createMockPrismaClient(): MockPrismaClient {
    return {
        roles: mock<RolesPrismaModel>(),
    };
}
