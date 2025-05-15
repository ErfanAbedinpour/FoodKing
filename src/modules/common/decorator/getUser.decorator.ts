import { createParamDecorator, ExecutionContext,  UnauthorizedException } from '@nestjs/common';
import { IAccessTokenPayload } from '../../auth/application/interfaces/accessTokenPayload';

export interface RequestUser extends IAccessTokenPayload{ }

export const GetUser = createParamDecorator(
  (data: keyof RequestUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    try{

      console.log("request user is ", request.user);
    return data? request.user[data]: request.user;
    }catch(err){
      throw new UnauthorizedException("Please log in First.")
    }
  },
);