import { mock, MockProxy } from 'jest-mock-extended';
import { PrismaModel } from '../../../app/infraestructure/prisma/prismaRepository';
import { User } from '../../../app/domains/users';
import { CreateUserData, UpdateUserData } from '../../../app/infraestructure/userRepository';

type UserPrismaModel = PrismaModel<User, CreateUserData, UpdateUserData, number>;
export type MockUserPrismaModel = MockProxy<UserPrismaModel>;

export interface MockUserPrismaClient {
    User: MockUserPrismaModel;
}

export function createMockUserPrismaClient(): MockUserPrismaClient {
    return {
        User: mock<UserPrismaModel>(),
    };
}
