import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ErrorMessage } from '../../../../ErrorMessages/Error.enum';
import { VerifyOtpCommand } from '../command/verify-otp.command';
import { GenerateUserTokenCommand } from '../command/generate-user-token.command';
import { UserService } from '../../../users/user.service';
import { OtpRepository } from '../../repository/abstract/opt-repository';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  private logger = new Logger(VerifyOtpHandler.name);

  constructor(
    private readonly userService: UserService,
    private readonly otpRepository: OtpRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: VerifyOtpCommand) {
    try {
      const otp = this.otpRepository.findOtp(command.phone);

      if (!otp || otp.exp < Date.now() || otp.code !== command.code)
        throw new BadRequestException(ErrorMessage.INVALID_OTP);

      const user = await this.userService.findByPhone(command.phone);

      if (!user) throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);

      console.log('name is ', user.name);

      return this.commandBus.execute(
        new GenerateUserTokenCommand(
          +user.id.toString(),
          user.name,
          user.role.name,
        ),
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;

      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
