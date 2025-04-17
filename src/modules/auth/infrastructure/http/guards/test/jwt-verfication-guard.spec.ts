import { JwtService } from "@nestjs/jwt"
import { Test } from '@nestjs/testing'
import { JwtVerificationGuard } from "../jwt-verification.guard"
import { ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common"
import { ErrorMessage } from "../../../../../../ErrorMessages/Error.enum"
import { Request } from "express"

describe("JWT Verification Guard", () => {
    let mockJwtService = {
        verifyAsync: jest.fn()
    } as unknown as JwtService
    let guard: JwtVerificationGuard;

    beforeEach(async () => {

        const moduleRef = await Test.createTestingModule({
            providers: [
                JwtVerificationGuard,
                {
                    provide: JwtService,
                    useValue: mockJwtService
                }
            ]
        }).compile()


        guard = moduleRef.get(JwtVerificationGuard);
    })


    it("Should be defined", () => {
        expect(guard).toBeDefined()
    })


    it("Should be throw Forbidden For Invalid Header Format", () => {
        const ctx = {
            switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: "" } }) })
        } as unknown as ExecutionContext


        expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException)
        expect(guard.canActivate(ctx)).rejects.toThrow(ErrorMessage.INVALID_HEADER)
    })

    it("Should be throw UnAuthorized because token is invalid", () => {
        const ctx = {
            switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: "bearer invalid-token" } }) })
        } as unknown as ExecutionContext

        jest.spyOn(mockJwtService, 'verifyAsync').mockRejectedValueOnce(new Error())

        expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException)
        expect(guard.canActivate(ctx)).rejects.toThrow(ErrorMessage.INVALID_TOKEN)
        expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('invalid-token', { secret: process.env.ACCESS_TOKEN_SECRET })
    })


    it("Should be returned true", async () => {
        const ctx = {
            switchToHttp: () => ({ getRequest: () => ({ headers: { authorization: "bearer valid-token" } }) })
        } as unknown as ExecutionContext

        jest.spyOn(mockJwtService, 'verifyAsync').mockResolvedValueOnce({ name: "test-name", role: 'test-role', userId: 1 })

        const res = await guard.canActivate(ctx);
        expect(res).toEqual(true)
        expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', { secret: process.env.ACCESS_TOKEN_SECRET })
    })

})