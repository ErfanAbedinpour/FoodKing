import { Test } from '@nestjs/testing'
import { CreateUserUseCase } from '../create-user'
import { UserRepository } from '../../../../users/domain/repository/user.repository'
import { UserEntity } from '../../../../users/domain/entities/user.entity'
import { BadRequestException } from '@nestjs/common'
import { ErrorMessage } from '../../../../../ErrorMessages/Error.enum'
import { userRepository } from './mocks/user-repository.mock'
describe("CreateUserUseCase", () => {



    let createUserUseCase: CreateUserUseCase;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateUserUseCase,
                {
                    provide: UserRepository,
                    useValue: userRepository
                }
            ]
        }).compile()

        createUserUseCase = moduleRef.get(CreateUserUseCase);
    })

    it("Should be defined", () => {
        expect(createUserUseCase).toBeDefined()
        expect(userRepository).toBeDefined()
    })


    it("should throw BadRequest because Phone is exist before", async () => {
        jest.spyOn(userRepository, 'findByPhone').mockResolvedValueOnce({} as UserEntity)

        const promise = createUserUseCase.execute({ email: 'test-email', name: "test-name", password: "test-pass", phone: "test-phone" })
        expect(promise).rejects.toThrow(BadRequestException)
        expect(promise).rejects.toThrow(ErrorMessage.PHONE_EXIST)
        expect(userRepository.findByPhone).toHaveBeenCalled()
    })


    it("Should be register user successful", async () => {

        const input = { email: 'test-email', name: "test-name", password: "test-pass", phone: "test-phone" }
        const userEntity = UserEntity.create(input.name, input.email, input.phone, input.password);
        jest.spyOn(userRepository, 'findByPhone').mockResolvedValueOnce(null)
        jest.spyOn(userRepository, 'create').mockResolvedValueOnce()
        jest.spyOn(UserEntity, 'create').mockReturnValueOnce(userEntity)

        const result = await createUserUseCase.execute(input)

        expect(result).toBe(undefined)
        expect(UserEntity.create).toHaveBeenCalled()
        expect(userRepository.create).toHaveBeenCalledWith(userEntity)
        expect(userRepository.findByPhone).toHaveBeenCalledWith('test-phone')
    })
})