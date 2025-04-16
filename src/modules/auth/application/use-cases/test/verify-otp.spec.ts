import { Test } from '@nestjs/testing'
import { UserRepository } from '../../../../users/domain/repository/user.repository'
import { OtpRepository } from '../../../domain/repository/opt-repository'
import { userRepository } from './mocks/user-repository.mock'
import { otpRepository } from './mocks/otp-repository.mock'
import { VerifyOtpUseCase } from '../verify-otp'
import { CommandBus } from '@nestjs/cqrs'
import { VerifyOtpCommand } from '../../command/verify-otp.command'
import { BadRequestException } from '@nestjs/common'
import { ErrorMessage } from '../../../../../ErrorMessages/Error.enum'
import { Otp } from '../../../domain/value-object/otp.vo'
import { UserEntity } from '../../../../users/domain/entities/user.entity'

describe("verifyOTP", () => {

    let verifyOtpUseCase: VerifyOtpUseCase;

    let commandBusMock = { execute: jest.fn() }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                VerifyOtpUseCase,
                {
                    provide: UserRepository,
                    useValue: userRepository
                },
                {
                    provide: OtpRepository,
                    useValue: otpRepository
                },
                {
                    provide: CommandBus,
                    useValue: commandBusMock
                }
            ]
        }).compile()

        verifyOtpUseCase = moduleRef.get(VerifyOtpUseCase);
    })

    it("Should be defined", () => {
        expect(verifyOtpUseCase).toBeDefined()
        expect(userRepository).toBeDefined()
        expect(otpRepository).toBeDefined()
        expect(commandBusMock).toBeDefined()
    })


    it("Should be throw BadRequest for Invalid Token", () => {
        jest.spyOn(otpRepository, 'findOtp').mockReturnValueOnce(undefined);

        const promise = verifyOtpUseCase.execute({ code: "", phone: "" } as VerifyOtpCommand)

        expect(promise).rejects.toThrow(BadRequestException)
        expect(promise).rejects.toThrow(ErrorMessage.INVALID_OTP)
    })


    it("Should be verified successful", async () => {
        const user = UserEntity.create("test", 'test-mail', '0911', '12341234');
        jest.spyOn(otpRepository, 'findOtp').mockReturnValueOnce(new Otp("12341234", Date.now() * 2))
        jest.spyOn(userRepository, 'findByPhone').mockResolvedValueOnce(user)
        jest.spyOn(commandBusMock, 'execute').mockResolvedValueOnce({ accessToken: "access", refreshToken: "refreshToken" })

        const res = await verifyOtpUseCase.execute({ code: '12341234', phone: '0911' } as VerifyOtpCommand)

        expect(otpRepository.findOtp).toHaveBeenCalledWith("0911")
        expect(userRepository.findByPhone).toHaveBeenCalledWith("0911")
        expect(res).toEqual({ accessToken: "access", refreshToken: "refreshToken" })
    })
})