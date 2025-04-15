import { UserRole } from "@models/index"
import { randomUUID } from "crypto"
import { UserId } from "../types/userId"
import { Email } from "../value-object/email.vo"
import { Phone } from "../value-object/phone.vo"

export class UserEntity{

    constructor(
        public id: UserId,
        public name: string,
        public email: Email,
        public role: UserRole,
        public phone_number: Phone,
    ) { }


    static create(name: string, email: string, role: UserRole, phone_number: string) {
        return new UserEntity(randomUUID(), name, new Email(email), role, new Phone(phone_number))
    }

}