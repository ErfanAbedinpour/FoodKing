import { Otp } from "../value-object/otp.vo";

export abstract class OtpRepository {
    abstract findOtp(phone: string): Otp | undefined
    abstract save(phone: string, code: Otp): void
    abstract del(phone: string): void
}