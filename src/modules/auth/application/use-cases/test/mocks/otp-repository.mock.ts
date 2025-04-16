import { OtpRepository } from "../../../../domain/repository/opt-repository";

export const otpRepository: OtpRepository = {
    save: jest.fn(),
    del: jest.fn(),
    findOtp: jest.fn(),
}

