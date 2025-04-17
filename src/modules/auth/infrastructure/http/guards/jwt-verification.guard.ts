import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { ErrorMessage } from "../../../../../ErrorMessages/Error.enum";
import { IAccessTokenPayload } from "../../../application/interfaces/accessTokenPayload";

@Injectable()
export class JwtVerificationGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest<Request>();

        const [bearer, token] = req.headers.authorization?.split(' ') || [];

        if (!bearer || !token)
            throw new ForbiddenException(ErrorMessage.INVALID_HEADER)

        try {

            const jwtPayload = await this.jwtService.verifyAsync<IAccessTokenPayload>(token, {
                secret: process.env.ACCESS_TOKEN_SECRET
            });

            req.user = { id: jwtPayload.userId, name: jwtPayload.name, role: jwtPayload.role };
            return true

        } catch (err) {
            throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN)
        }
    }


}


declare global {
    namespace Express {
        interface Request {
            user: {
                id: number;
                name: string;
                role: string;
            }
        }
    }
}