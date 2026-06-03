import { mock, MockProxy } from 'jest-mock-extended';
import { RoleRepository } from '../../../app/infraestructure/roleRepository';

export type MockRoleRepository = MockProxy<RoleRepository>;

export function createMockRoleRepository(): MockRoleRepository {
  return mock<RoleRepository>();
}
