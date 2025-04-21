import { Test } from '@nestjs/testing'
import { JwtVerificationGuard } from "../jwt-verification.guard"
import { AuthorizationGuard } from "../authorization.guard"
import { Reflector } from "@nestjs/core"
import { ExecutionContext } from '@nestjs/common'

describe("JWT Verification Guard", () => {
    let mockAuthGuard = {
        canActivate: jest.fn()
    } as unknown as AuthorizationGuard

    let mockReflector = {
        getAll: jest.fn()
    } as unknown as Reflector

    let guard: AuthorizationGuard;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthorizationGuard,
                {
                    provide: JwtVerificationGuard,
                    useValue: mockAuthGuard
                },
                {
                    provide: Reflector,
                    useValue: mockReflector
                }
            ]
        }).compile()


        guard = moduleRef.get(AuthorizationGuard);
    })


    it("Should be defined", () => {
        expect(guard).toBeDefined()
        expect(mockAuthGuard).toBeDefined()
        expect(mockReflector).toBeDefined()
    })
    const mockCtx = {
        getHandler: jest.fn(),
        getClass: jest.fn()
    } as unknown as ExecutionContext

    it('Should be return true because there are no Meta', async () => {
        jest.spyOn(mockReflector, 'getAll').mockReturnValueOnce([undefined])

        const res = await guard.canActivate(mockCtx)
        expect(res).toEqual(true)
        expect(mockReflector.getAll).toHaveBeenCalled()
        expect(mockCtx.getClass).toHaveBeenCalled()
        expect(mockCtx.getHandler).toHaveBeenCalled()
    })


    it('Should be passed to JwtVerification Guard and return true from it', async () => {
        jest.spyOn(mockReflector, 'getAll').mockReturnValueOnce([true])
        jest.spyOn(mockAuthGuard, 'canActivate').mockResolvedValueOnce(true);

        const res = await guard.canActivate(mockCtx)
        expect(res).toEqual(true)
        expect(mockAuthGuard.canActivate).toHaveBeenCalled()
    })
})