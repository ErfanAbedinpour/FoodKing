import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDTO } from './DTO/auth.DTO';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './application/command/createUser.command';
import { SendOtpCommand } from './application/command/send-otp.command';
import { VerifyOtpCommand } from './application/command/verify-otp.command';
import { SendOtpDTO } from './DTO/send-otp.DTO';
import { VerifyOtpDTO } from './DTO/verify-otp.DTO';
import { GenerateTokenDTO } from './DTO/generate-token.DTO';
import { GenerateNewTokensCommand } from './application/command/generate-new-tokens.command';
import { generateTokenSwagger, signinSwagger, signupSwagger, verifySwagger } from './auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('signup')
  @signupSwagger()
    async register(@Body() createdUserDto: CreateUserDTO) {
    await this.commandBus.execute(
      new CreateUserCommand(
        createdUserDto.name,
        createdUserDto.phone,
        createdUserDto.email,
        createdUserDto.password,
      ),
    );
    return { msg: 'user registered successfully' };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @signinSwagger()
  async sendOTP(@Body() sendOtp: SendOtpDTO) {
    const { code } = await this.commandBus.execute(
      new SendOtpCommand(sendOtp.phone),
    );
    return { msg: 'Otp Sended successfully', code };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @verifySwagger()
    async verifyOtp(@Body() verifyOtp: VerifyOtpDTO) {
    const res = await this.commandBus.execute(
      new VerifyOtpCommand(verifyOtp.code, verifyOtp.phone),
    );
    return res;
  }

  @Post('/token')
  @generateTokenSwagger()
  @HttpCode(HttpStatus.OK)
  generateToken(@Body() generateTokenDto: GenerateTokenDTO) {
    return this.commandBus.execute(
      new GenerateNewTokensCommand(generateTokenDto.refreshToken),
    );
  }
}
