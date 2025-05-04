import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDTO } from './DTO/auth.DTO';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './application/command/createUser.command';
import { SendOtpCommand } from './application/command/send-otp.command';
import { VerifyOtpCommand } from './application/command/verify-otp.command';
import { SendOtpDTO } from './DTO/send-otp.DTO';
import { VerifyOtpDTO } from './DTO/verify-otp.DTO';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GenerateTokenDTO } from './DTO/generate-token.DTO';
import { GenerateNewTokensCommand } from './application/command/generate-new-tokens.command';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: 'user Created successfully',
    schema: { type: 'object', properties: { msg: { type: 'string' } } },
  })
  @ApiBadRequestResponse({ description: 'BadRequest Exception' })
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
  @ApiOkResponse({
    description: 'OTP Sended successfully',
    schema: { type: 'object', properties: { msg: { type: 'string' } } },
  })
  @ApiBadRequestResponse({ description: 'BadRequest Exception' })
  async sendOTP(@Body() sendOtp: SendOtpDTO) {
    const { code } = await this.commandBus.execute(
      new SendOtpCommand(sendOtp.phone),
    );
    return { msg: 'Otp Sended successfully', code };
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'user verified successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'BadRequest Exception' })
  async verifyOtp(@Body() verifyOtp: VerifyOtpDTO) {
    const res = await this.commandBus.execute(
      new VerifyOtpCommand(verifyOtp.code, verifyOtp.phone),
    );
    return res;
  }

  @Post('/token')
  @ApiBody({ type: GenerateTokenDTO })
  @ApiOkResponse({
    description: 'token generated successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'token is invalid' })
  @HttpCode(HttpStatus.OK)
  generateToken(@Body() generateTokenDto: GenerateTokenDTO) {
    return this.commandBus.execute(
      new GenerateNewTokensCommand(generateTokenDto.refreshToken),
    );
  }
}
