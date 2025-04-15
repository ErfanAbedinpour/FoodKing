import { Module } from "@nestjs/common";
import { UserModule } from "../users/user.module";
import { Hashing } from "./infrastructure/HashStrategies/hash";
import { ArgonHash } from "./infrastructure/HashStrategies/argon-hash";
import { AuthController } from "./infrastructure/http/auth.controller";
import { CreateUserUseCase } from "./application/use-cases/create-user";
import { OtpRepository } from "./domain/repository/opt-repository";
import { MemoryOtpRepository } from "./infrastructure/repository/memory.otp.repository";

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [
        CreateUserUseCase,
        {
            provide: Hashing,
            useClass: ArgonHash
        },
        {
            provide: OtpRepository,
            useClass: MemoryOtpRepository
        }
    ]
})
export class AuthModule { }