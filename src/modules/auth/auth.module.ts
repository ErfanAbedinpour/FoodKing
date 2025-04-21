import { Module } from "@nestjs/common";
import { UserModule } from "../users/user.module";
import { AuthController } from "./auth.controller";
import { CreateUserUseCase } from "./application/handler/create-user";
import { VerifyOtpUseCase } from "./application/handler/verify-otp";
import { SendOtpUseCase } from "./application/handler/send-otp";
import { JwtModule } from "@nestjs/jwt";
import { GenerateTokenUseCase } from "./application/handler/generateUserToken";
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

@Module({
    imports: [UserModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        GenerateTokenUseCase,
        CreateUserUseCase,
        SendOtpUseCase,
        VerifyOtpUseCase,
        JwtVerificationGuard,
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