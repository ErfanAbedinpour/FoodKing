import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../../../auth/application/command/createUser.command";
import { UserRepository } from "../../../users/domain/repository/user.repository";
import { UserEntity } from "../../../users/domain/entities/user.entity";
import { BadRequestException } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";
import { VerifyOtpCommand } from "../command/verify-otp.command";
import { OtpRepository } from "../../domain/repository/opt-repository";

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpUseCase implements ICommandHandler<VerifyOtpCommand, void> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository
    ) { }

    async execute(command: VerifyOtpCommand): Promise<void> {
        try {
            const otp = this.otpRepository.findOtp(command.phone);
            if (!otp || !otp.isValid())
                throw new BadRequestException(ErrorMessage.INVALID_OTP)

            const user = this.userRepository.findByPhone(command.phone);


            // here should generated Token


        } catch (err) {
            throw err;
        }
    }
}