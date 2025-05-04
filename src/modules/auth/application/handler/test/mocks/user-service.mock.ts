import { UserService } from '../../../../../users/user.service';

export let userService = {
  createUser: jest.fn(),
  findById: jest.fn(),
  findByPhone: jest.fn(),
} as unknown as UserService;
