import { mock, MockProxy } from 'jest-mock-extended';
import { PrismaModel } from '../../../app/infraestructure/prisma/prismaRepository';
import { Permission } from '../../../app/domains/permissions';
import { CreatePermissionData, UpdatePermissionData } from '../../../app/infraestructure/permissionRepository';

type PermissionPrismaModel = PrismaModel<Permission, CreatePermissionData, UpdatePermissionData, number>;
export type MockPermissionPrismaModel = MockProxy<PermissionPrismaModel>;

export interface MockPermissionPrismaClient {
    Permission: MockPermissionPrismaModel;
}

export function createMockPermissionPrismaClient(): MockPermissionPrismaClient {
    return {
        Permission: mock<PermissionPrismaModel>(),
    };
}
