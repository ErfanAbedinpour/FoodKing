import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizationGuard } from './guards/authorization.guard';
import { RoleAccessGuard } from './guards/role-access.guard';
import { JwtVerificationGuard } from './guards/jwt-verification.guard';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports:[JwtModule.register({})],
  providers: [
    JwtVerificationGuard,
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleAccessGuard,
    },
  ],
})
export class CommonModule {}
