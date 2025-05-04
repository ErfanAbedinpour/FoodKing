import { OtpRepository } from '../../../../repository/abstract/opt-repository';

export const otpRepository: OtpRepository = {
  save: jest.fn(),
  del: jest.fn(),
  findOtp: jest.fn(),
};
