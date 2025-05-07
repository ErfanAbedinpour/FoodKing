import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtVerificationGuard } from './jwt-verification.guard';
import { Reflector } from '@nestjs/core';
import { AuthToken } from '../decorator/auth.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly jwtVerificationGuard: JwtVerificationGuard,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isAuthMeta = this.reflector.getAll<boolean[]>(AuthToken, [
      ctx.getClass(),
      ctx.getHandler(),
    ]) || [undefined];

    for (const meta of isAuthMeta) {
      try {
        meta && (await this.jwtVerificationGuard.canActivate(ctx));
      } catch (err) {
        throw err;
      }
    }
    return true;
  }
}
