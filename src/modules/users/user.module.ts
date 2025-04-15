import { Module } from "@nestjs/common";
import { CreateUserUseCase } from "./application/use-cases/create-user";

@Module({
    imports: [],

    providers: [
        CreateUserUseCase,
    ],
})
export class UserModule { }