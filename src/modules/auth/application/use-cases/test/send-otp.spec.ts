import { Test } from '@nestjs/testing'
import { UserRepository } from '../../../../users/domain/repository/user.repository'
import { SendOtpUseCase } from '../send-otp'
import { OtpRepository } from '../../../domain/repository/opt-repository'
import { userRepository } from './mocks/user-repository.mock'
import { otpRepository } from './mocks/otp-repository.mock'
import { UserEntity } from '../../../../users/domain/entities/user.entity'
import { BadRequestException } from '@nestjs/common'
import { ErrorMessage } from '../../../../../ErrorMessages/Error.enum'

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


    it("Should be throw BadRequest because use does not found", () => {
        jest.spyOn(userRepository, 'findByPhone').mockResolvedValueOnce(null)


        expect(sendOtpUseCase.execute({ phone: 'test-phone' })).rejects.toThrow(BadRequestException)
        expect(sendOtpUseCase.execute({ phone: 'test-phone' })).rejects.toThrow(ErrorMessage.USER_NOT_FOUND)
    })


    it("Should be Send OTP for User", async () => {
        const user = UserEntity.create('test', 'test', '1234', '12341234')
        jest.spyOn(userRepository, 'findByPhone').mockResolvedValueOnce(user)
        jest.spyOn(otpRepository, 'save').mockReturnValue()

        const res = await sendOtpUseCase.execute({ phone: '1234' })

        expect(userRepository.findByPhone).toHaveBeenCalledWith('1234')
        expect(otpRepository.save).toHaveBeenCalled()
        expect(res).toBeUndefined()
    })

})