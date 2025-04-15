export class VerifyOtpCommand {
    constructor(
        public readonly code: string,
        public readonly phone: string
    ) { }
}