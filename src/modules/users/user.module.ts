import { Module } from "@nestjs/common";
import { UserRepository } from "./domain/repository/user.repository";
import { MikroUserRepository } from "./infrastructure/repository/user-mikro-orm.repository";

@Module({
    providers: [
        {
            provide: UserRepository,
            useClass: MikroUserRepository
        }
    ],
    exports: [UserRepository]
})
export class UserModule { }