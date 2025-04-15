import { UserRole } from "@models/index"
import { randomUUID } from "crypto"
import { UserId } from "../types/userId"
import { Email } from "../value-object/email.vo"
import { Phone } from "../value-object/phone.vo"
import { Role } from "../value-object/role.vo"

export class UserEntity {

    constructor(
        public id: UserId,
        public name: string,
        public email: Email,
        public role: Role,
        public phone_number: Phone,
        public password: string,
    ) { }


    static create(name: string, email: string, role: UserRole, phone_number: string, password: string) {
        return new UserEntity(randomUUID(), name, new Email(email), new Role(role), new Phone(phone_number), password)
    }
}