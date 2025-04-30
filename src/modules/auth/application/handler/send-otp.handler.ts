import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ErrorMessage } from '../../../../ErrorMessages/Error.enum';
import { SendOtpCommand } from '../command/send-otp.command';
import { UserService } from '../../../users/user.service';
import { OtpRepository } from '../../repository/abstract/opt-repository';

@CommandHandler(SendOtpCommand)
export class SendOtpHandler
  implements ICommandHandler<SendOtpCommand, { code: string }>
{
  private readonly logger = new Logger(SendOtpHandler.name);

  constructor(
    private readonly userService: UserService,
    private readonly otpRepository: OtpRepository,
  ) {}

  generateOTP() {
    return Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  }

  async execute(command: SendOtpCommand): Promise<{ code: string }> {
    try {
      const user = await this.userService.findByPhone(command.phone);

      if (!user) throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);

      const code = this.generateOTP().toString();
      this.otpRepository.save(command.phone, code, 2 * 60 * 1000 + Date.now());

      console.log('code is ', code);

      return { code };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
