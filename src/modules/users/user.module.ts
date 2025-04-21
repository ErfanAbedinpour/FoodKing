import { Module } from "@nestjs/common";
import { MikroUserRepository } from "./repository/user-mikro-orm.repository";
import { UserRepository } from "./repository/user.repository";

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