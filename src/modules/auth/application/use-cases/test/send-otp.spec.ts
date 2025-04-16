import { Test } from '@nestjs/testing'
import { UserRepository } from '../../../../users/domain/repository/user.repository'
import { SendOtpUseCase } from '../send-otp'
import { OtpRepository } from '../../../domain/repository/opt-repository'
import { userRepository } from './mocks/user-repository.mock'
import { otpRepository } from './mocks/otp-repository.mock'

describe("SendOTPUseCase", () => {

    let sendOtpUseCase: SendOtpUseCase;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                SendOtpUseCase,
                {
                    provide: UserRepository,
                    useValue: userRepository
                },
                {
                    provide: OtpRepository,
                    useValue: otpRepository
                }
            ]
        }).compile()

        sendOtpUseCase = moduleRef.get(SendOtpUseCase);
    })

    it("Should be defined", () => {
        expect(sendOtpUseCase).toBeDefined()
        expect(userRepository).toBeDefined()
        expect(otpRepository).toBeDefined()
    })

})