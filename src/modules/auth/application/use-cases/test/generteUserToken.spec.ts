import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { GenerateTokenUseCase } from '../generateUserToken'
import { UserSessionRepository } from '../../../domain/repository/user-session.repository'
import { randomUUID, UUID } from 'crypto'

jest.mock('crypto', () => ({
    ...jest.requireActual('crypto'),
    randomUUID: jest.fn(),
}))
describe("GenerateUserTokenUseCase", () => {

    let jwtServiceMock = {
        signAsync: jest.fn(),
    } as unknown as JwtService

    let userTokenUseCase: GenerateTokenUseCase;

    let sessionRepository = {
        create: jest.fn()
    } as unknown as UserSessionRepository


    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                GenerateTokenUseCase,
                {
                    provide: UserSessionRepository,
                    useValue: sessionRepository
                },
                {
                    provide: JwtService,
                    useValue: jwtServiceMock
                }
            ]
        }).compile()

        userTokenUseCase = moduleRef.get(GenerateTokenUseCase);
    })

    it("Should be defined", () => {
        expect(sessionRepository).toBeDefined()
        expect(userTokenUseCase).toBeDefined()
        expect(jwtServiceMock).toBeDefined()
    })


    it("Should be generated Tokens", async () => {
        jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValueOnce("access-token");
        jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValueOnce("refresh-token");
        jest.spyOn(sessionRepository, 'create').mockResolvedValueOnce();
        (randomUUID as jest.Mock).mockReturnValue('token-id' as UUID)

        const user = { name: 'test-name', userId: 1, role: "Customer" }
        const result = await userTokenUseCase.execute({ name: user.name, role: user.role, userId: user.userId });

        expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);
        expect(randomUUID).toHaveBeenCalled()
        expect(sessionRepository.create).toHaveBeenCalledWith(user.userId, 'refresh-token', 'token-id')
        expect(result).toBeTruthy()
        expect(result).toEqual({ accessToken: "access-token", refreshToken: 'refresh-token' })
    })

})