import { UserRole } from "@models/index"
import { randomUUID } from "crypto"
import { Email } from "../value-object/email.vo"
import { Phone } from "../value-object/phone.vo"
import { Role } from "../value-object/role.vo"
import { UserId } from "../value-object/userId.vo"

export class UserEntity {

    private otp: string;
    constructor(
        public id: UserId,
        public name: string,
        public email: Email,
        public phone_number: Phone,
        public password: string,
        public role: Role,
    ) { }


    static create(name: string, email: string, phone_number: string, password: string, role: UserRole = UserRole.Customer): UserEntity {
        return new UserEntity(new UserId(randomUUID()), name, new Email(email), new Phone(phone_number), password, new Role(role))
    }

    static reCreate(id: number, name: string, email: string, phone_number: string, password: string, role: UserRole = UserRole.Customer) {
        return new UserEntity(new UserId(id), name, new Email(email), new Phone(phone_number), password, new Role(role))
    }

    validateOTP(otp: string) {
        return this.otp === otp
    }

    setOtp(otp: string) {
        this.otp = otp;
    }
}