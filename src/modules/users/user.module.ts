import { Module } from "@nestjs/common";
import { CreateUserUseCase } from "./application/use-cases/create-user";
import { UserController } from "./infrastructure/http/user.controller";
import { UserRepository } from "./domain/repository/user.repository";
import { MikroUserRepository } from "./infrastructure/repository/user-mikro-orm.repository";

@Module({
    controllers: [UserController],
    providers: [
        CreateUserUseCase,
        {
            provide: UserRepository,
            useClass: MikroUserRepository
        }
    ],
    exports: [UserRepository]
})
export class UserModule { }