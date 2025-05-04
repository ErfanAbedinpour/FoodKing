import { UserSessionRepository } from '../../../../repository/abstract/user-session.repository';

export const userSessionRepository = {
  isValidate: jest.fn(),
  invalidate: jest.fn(),
} as unknown as UserSessionRepository;
