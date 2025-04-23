import { Module } from "@nestjs/common";
import { UserModule } from "../users/user.module";
import { AuthController } from "./auth.controller";
import { JwtVerificationGuard } from "./guards/jwt-verification.guard";
import { APP_GUARD } from "@nestjs/core";
import { AuthorizationGuard } from "./guards/authorization.guard";
import { RoleAccessGuard } from "./guards/role-access.guard";
import { Hashing } from "./hashing/hash";
import { ArgonHash } from "./hashing/argon-hash";
import { OtpRepository } from "./repository/abstract/opt-repository";
import { MemoryOtpRepository } from "./repository/memory.otp.repository";
import { UserSessionRepository } from "./repository/abstract/user-session.repository";
import { MikroOrmUserSessionRepository } from "./repository/mikro-orm-user-session.repository";
import { GenerateTokenHandler } from "./application/handler/generateUserToken.handler";
import { JwtModule } from "@nestjs/jwt";
import { CreateUserHandler } from "./application/handler/create-user.handler";
import { SendOtpHandler } from "./application/handler/send-otp.handler";
import { VerifyOtpHandler } from "./application/handler/verify-otp.handler";
import { GenerateNewTokensHandler } from "./application/handler/generate-new-tokens.handler";

@Module({
    imports: [UserModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        GenerateTokenHandler,
        CreateUserHandler,
        SendOtpHandler,
        VerifyOtpHandler,
        JwtVerificationGuard,
        GenerateNewTokensHandler,
        {
            provide: APP_GUARD,
            useClass: AuthorizationGuard
        },
        {
            provide: APP_GUARD,
            useClass: RoleAccessGuard
        },
        {
            provide: Hashing,
            useClass: ArgonHash
        },
        {
            provide: OtpRepository,
            useClass: MemoryOtpRepository
        },
        {
            provide: UserSessionRepository,
            useClass: MikroOrmUserSessionRepository
        }
    ]
})
export class AuthModule { }