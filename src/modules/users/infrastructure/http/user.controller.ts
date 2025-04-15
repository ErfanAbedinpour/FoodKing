import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateUserDTO } from "./DTO/create-user.DTO";
import { CreateUserCommand } from "../../application/commands/createUser.command";

@Controller("users")
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }


    @Post()
    async createUser(@Body() { email, name, password, phone, role }: CreateUserDTO) {
        await this.commandBus.execute(new CreateUserCommand(name, phone, role, email, password))
        return { msg: "user registered successfully" }
    }
}