import { UserRole } from "../../../../models";

export class CreateUserCommand {
    constructor(
        public name: string,
        public phone: string,
        public role: UserRole,
        public email: string,
        public password: string,
    ) { }
}