import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";
import { SendOtpCommand } from "../command/send-otp.command";
import { UserService } from "../../../users/user.service";
import { OtpRepository } from "../../repository/abstract/opt-repository";

@CommandHandler(SendOtpCommand)
export class SendOtpUseCase implements ICommandHandler<SendOtpCommand, void> {
    constructor(
        private readonly userService: UserService,
        private readonly otpRepository: OtpRepository
    ) { }


    generateOTP() {
        return Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
    }


    async execute(command: SendOtpCommand): Promise<void> {
        try {

            const user = await this.userService.findByPhone(command.phone);

            if (!user)
                throw new BadRequestException(ErrorMessage.USER_NOT_FOUND);

            const code = this.generateOTP().toString()
            this.otpRepository.save(command.phone, code, 2 * 60 * 1000 + Date.now());

            console.log('code is ', code);

            return
        } catch (err) {
            throw err;
        }
    }
}