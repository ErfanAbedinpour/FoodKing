import { MenuRepository } from '../../repository/abstract/menu.repository';

export const MenuRepositoryMock: MenuRepository = {
  create: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findBySlug: jest.fn(),
  update: jest.fn(),
};
