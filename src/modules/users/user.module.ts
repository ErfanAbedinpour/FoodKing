import { Module } from "@nestjs/common";
import { MikroUserRepository } from "./repository/user-mikro-orm.repository";
import { UserRepository } from "./repository/user.repository";
import { UserService } from "./user.service";

@Module({
    providers: [
        UserService,
        {
            provide: UserRepository,
            useClass: MikroUserRepository
        }
    ],
    exports: [UserService]
})
export class UserModule { }