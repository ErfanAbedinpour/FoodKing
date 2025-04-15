import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserRepository } from "../../../users/domain/repository/user.repository";
import { BadRequestException } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";
import { SendOtpCommand } from "../command/send-otp.command";
import { OtpRepository } from "../../domain/repository/opt-repository";
import { Otp } from "../../domain/value-object/otp.vo";

@CommandHandler(SendOtpCommand)
export class SendOtpUseCase implements ICommandHandler<SendOtpCommand, void> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository
    ) { }

    async execute(command: SendOtpCommand): Promise<void> {
        // const user = 
        try {

            const user = await this.userRepository.findByPhone(command.phone);

            if (!user)
                throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);




            const otpCode = new Otp("random", 2 * 60 * 1000 + Date.now());
            this.otpRepository.save(user.phone_number.value, otpCode);
            console.log('code is ', otpCode);
            return
        } catch (err) {
            throw err;
        }
    }
}