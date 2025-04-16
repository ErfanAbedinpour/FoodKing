

export class GenerateUserTokenCommand {
    constructor(
        public readonly userId: number,
        public readonly name: string,
        public readonly role: string
    ) { }
}