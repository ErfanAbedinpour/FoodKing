import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateUserDTO } from "./DTO/auth.DTO";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../../application/command/createUser.command";
import { SendOtpCommand } from "../../application/command/send-otp.command";
import { VerifyOtpCommand } from "../../application/command/verify-otp.command";
import { SendOtpDTO } from "./DTO/send-otp.DTO";
import { VerifyOtpDTO } from "./DTO/verify-otp.DTO";

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

    @Post("send-otp")
    @HttpCode(HttpStatus.OK)
    async sendOTP(@Body() sendOtp: SendOtpDTO) {
        await this.commandBus.execute(new SendOtpCommand(sendOtp.phone));
        return { msg: "Otp Sended successfully" }
    }


    @Post("verify-otp")
    @HttpCode(HttpStatus.OK)
    async verifyOtp(@Body() verifyOtp: VerifyOtpDTO) {
        const res = await this.commandBus.execute(new VerifyOtpCommand(verifyOtp.code, verifyOtp.phone));
        return res

    }



    @Post("/token")
    @HttpCode(HttpStatus.OK)
    generateToken() { }
}