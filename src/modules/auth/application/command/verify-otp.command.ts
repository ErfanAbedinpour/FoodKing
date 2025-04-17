import { Command } from "@nestjs/cqrs";

export class VerifyOtpCommand extends Command<{ accessToken: any, refreshToken: any }> {
    constructor(
        public readonly code: string,
        public readonly phone: string
    ) {
        super()
    }
}