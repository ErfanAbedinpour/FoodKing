import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserRepository } from "../../../users/domain/repository/user.repository";
import { BadRequestException } from "@nestjs/common";
import { ErrorMessage } from "../../../../ErrorMessages/Error.enum";
import { VerifyOtpCommand } from "../command/verify-otp.command";
import { OtpRepository } from "../../domain/repository/opt-repository";
import { randomUUID } from "crypto";

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpUseCase implements ICommandHandler<VerifyOtpCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository
    ) { }

    async execute(command: VerifyOtpCommand) {
        try {
            const otp = this.otpRepository.findOtp(command.phone);

            if (!otp || !otp.isValid() || otp.code !== command.code)
                throw new BadRequestException(ErrorMessage.INVALID_OTP)

            const user = await this.userRepository.findByPhone(command.phone);
            // here should generated Token
            // TODO: Write AccessToken And RefreshToken
            const AccessTokenPayload = {
                id: user?.id,
                name: user?.name,
            }

            const tokenId = randomUUID()

            const refreshTokenPayload = {
                tokenId,
            }

            return {
                accessToken: AccessTokenPayload,
                refreshToken: refreshTokenPayload
            }

        } catch (err) {
            throw err;
        }
    }
}