import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAccessTokenPayload } from '../../auth/application/interfaces/accessTokenPayload';

export interface RequestUser extends IAccessTokenPayload{ }

export const GetUser = createParamDecorator(
  (data: keyof RequestUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data? request.user[data]: request.user;
  },
);