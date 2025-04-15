import { Module } from "@nestjs/common";
import { UserModule } from "../users/user.module";
import { Hashing } from "./infrastructure/hash/hash";
import { ArgonHash } from "./infrastructure/hash/argon-hash";

@Module({
    imports: [UserModule],
    controllers: [],
    providers: [
        {
            provide: Hashing,
            useClass: ArgonHash
        }
    ]
})
export class AuthModule { }