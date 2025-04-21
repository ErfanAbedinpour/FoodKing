import { Test } from '@nestjs/testing'
import { SendOtpHandler as SendOtpUseCase } from '../send-otp.handler'
import { BadRequestException } from '@nestjs/common'
import { ErrorMessage } from '../../../../../ErrorMessages/Error.enum'
import { UserService } from '../../../../users/user.service'
import { userService } from './mocks/user-service.mock'
import { OtpRepository } from '../../../repository/abstract/opt-repository'
import { otpRepository } from './mocks/otp-repository.mock'
import { User } from '../../../../../models'

describe("SendOTPUseCase", () => {

    let sendOtpUseCase: SendOtpUseCase;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                SendOtpUseCase,
                {
                    provide: UserService,
                    useValue: userService
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
        expect(userService).toBeDefined()
        expect(otpRepository).toBeDefined()
    })


    it("Should be throw BadRequest because use does not found", () => {
        jest.spyOn(userService, 'findByPhone').mockResolvedValueOnce(null)


        expect(sendOtpUseCase.execute({ phone: 'test-phone' })).rejects.toThrow(BadRequestException)
        expect(sendOtpUseCase.execute({ phone: 'test-phone' })).rejects.toThrow(ErrorMessage.USER_NOT_FOUND)
    })


    it("Should be Send OTP for User", async () => {
        const user = { name: "test", email: "test-mail", phone_number: "1234", password: '12341324' }
        jest.spyOn(userService, 'findByPhone').mockResolvedValueOnce(user as User)
        jest.spyOn(otpRepository, 'save').mockReturnValue()

        const res = await sendOtpUseCase.execute({ phone: '1234' })

        expect(userService.findByPhone).toHaveBeenCalledWith('1234')
        expect(otpRepository.save).toHaveBeenCalled()
        expect(res).toHaveProperty('code')
    })

})