import { Module } from "@nestjs/common";
import { UserModule } from "../users/user.module";
import { Hashing } from "./infrastructure/HashStrategies/hash";
import { ArgonHash } from "./infrastructure/HashStrategies/argon-hash";
import { AuthController } from "./infrastructure/http/auth.controller";
import { CreateUserUseCase } from "./application/use-cases/create-user";
import { OtpRepository } from "./domain/repository/opt-repository";
import { MemoryOtpRepository } from "./infrastructure/repository/memory.otp.repository";
import { VerifyOtpUseCase } from "./application/use-cases/verify-otp";
import { SendOtpUseCase } from "./application/use-cases/send-otp";
import { JwtModule } from "@nestjs/jwt";
import { UserSessionRepository } from "./domain/repository/user-session.repository";
import { MikroOrmUserSessionRepository } from "./infrastructure/repository/mikro-orm-user-session.repository";
import { GenerateTokenUseCase } from "./application/use-cases/generateUserToken";
import { JwtVerificationGuard } from "./infrastructure/http/guards/jwt-verification.guard";

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