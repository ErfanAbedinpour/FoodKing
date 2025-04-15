import { OtpRepository } from "../../domain/repository/opt-repository";
import { Otp } from "../../domain/value-object/otp.vo";

export class MemoryOtpRepository implements OtpRepository {
    public codes: Map<string, Otp> = new Map();

    del(phone: string): void {
        this.codes.delete(phone);
    }

    findOtp(phone: string): Otp | undefined {
        return this.codes.get(phone);
    }

    save(phone: string, code: Otp): void {
        this.codes.set(phone, code);
    }
}