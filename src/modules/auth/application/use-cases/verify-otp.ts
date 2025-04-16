import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserRepository } from "../../../users/domain/repository/user.repository";
import { BadRequestException, HttpException, InternalServerErrorException, Logger } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";
import { VerifyOtpCommand } from "../command/verify-otp.command";
import { OtpRepository } from "../../domain/repository/opt-repository";
import { GenerateUserTokenCommand } from "../command/generate-user-token.command";

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpUseCase implements ICommandHandler<VerifyOtpCommand> {
    private logger = new Logger(VerifyOtpUseCase.name)

    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository,
        private readonly commandBus: CommandBus
    ) { }

    async execute(command: VerifyOtpCommand) {
        try {
            const otp = this.otpRepository.findOtp(command.phone);

            if (!otp || !otp.isValid() || otp.code !== command.code)
                throw new BadRequestException(ErrorMessage.INVALID_OTP)

            const user = await this.userRepository.findByPhone(command.phone);

            if (!user)
                throw new BadRequestException(ErrorMessage.USER_NOT_FOUND)

            return this.commandBus.execute(new GenerateUserTokenCommand(+user.id.toString(), user.name, user.role.value))
        } catch (err) {
            if (err instanceof HttpException)
                throw err

            this.logger.error(err)
            throw new InternalServerErrorException()
        }
    }
}