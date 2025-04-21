import { Test } from '@nestjs/testing'
import { otpRepository } from './mocks/otp-repository.mock'
import { VerifyOtpUseCase } from '../verify-otp'
import { CommandBus } from '@nestjs/cqrs'
import { VerifyOtpCommand } from '../../command/verify-otp.command'
import { BadRequestException } from '@nestjs/common'
import { ErrorMessage } from '../../../../../ErrorMessages/Error.enum'
import { UserService } from '../../../../users/user.service'
import { OtpRepository } from '../../../repository/abstract/opt-repository'
import { userService } from './mocks/user-service.mock'
import { User } from '../../../../../models'

describe("verifyOTP", () => {

    let verifyOtpUseCase: VerifyOtpUseCase;

    let commandBusMock = { execute: jest.fn() }

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                VerifyOtpUseCase,
                {
                    provide: UserService,
                    useValue: userService
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
        expect(userService).toBeDefined()
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
        const user = { id: 2, name: "test", email: 'test-mail', phone_number: '0911', password: '12341234', role: { name: "ADMIN" } };
        jest.spyOn(otpRepository, 'findOtp').mockReturnValueOnce({ code: "12341234", exp: Date.now() * 2 })
        jest.spyOn(userService, 'findByPhone').mockResolvedValueOnce(user as User)
        jest.spyOn(commandBusMock, 'execute').mockResolvedValueOnce({ accessToken: "access", refreshToken: "refreshToken" })

        const res = await verifyOtpUseCase.execute({ code: '12341234', phone: '0911' } as VerifyOtpCommand)

        expect(otpRepository.findOtp).toHaveBeenCalledWith("0911")
        expect(userService.findByPhone).toHaveBeenCalledWith("0911")
        expect(res).toEqual({ accessToken: "access", refreshToken: "refreshToken" })
    })
})