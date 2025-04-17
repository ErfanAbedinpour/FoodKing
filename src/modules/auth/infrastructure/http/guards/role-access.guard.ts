import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../../../../models";
import { Request } from "express";
import { ErrorMessage } from "../../../../../ErrorMessages/Error.enum";
import { ROLE_ACCESS } from "../decorator/role-access.decorator";

@Injectable()
export class RoleAccessGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    async canActivate(ctx: ExecutionContext) {

        const roleMeta = this.reflector.getAll<UserRole[]>(ROLE_ACCESS, [ctx.getClass(), ctx.getHandler()]) || undefined

        if (!roleMeta)
            return true;

        const req = ctx.switchToHttp().getRequest<Request>()

        const isAccess = roleMeta.every(role => req.user.role === role);

        try {
            if (!isAccess)
                throw new ForbiddenException(ErrorMessage.INVALID_ACCESS)

            return true;

        } catch (err) {
            throw err
        }
    }
}