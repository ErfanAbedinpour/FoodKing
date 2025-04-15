import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateUserDTO } from "./DTO/auth.DTO";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../../application/command/createUser.command";

@Controller("auth")
export class AuthController {

    constructor(
        private readonly commandBus: CommandBus
    ) { }

    @Post("singup")
    async register(@Body() createdUserDto: CreateUserDTO) {
        await this.commandBus.execute(new CreateUserCommand(createdUserDto.name, createdUserDto.phone, createdUserDto.email, createdUserDto.password));
        return { msg: "user registered successfully" };
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login() { }


    @Post("/token")
    @HttpCode(HttpStatus.OK)
    generateToken() { }
}