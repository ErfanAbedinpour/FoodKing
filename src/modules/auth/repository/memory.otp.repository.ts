import { IOtp } from '../application/interfaces/otp';
import { OtpRepository } from './abstract/opt-repository';

export class MemoryOtpRepository implements OtpRepository {
  public codes: Map<string, IOtp> = new Map();

  del(phone: string): void {
    this.codes.delete(phone);
  }

  findOtp(phone: string): IOtp | undefined {
    return this.codes.get(phone);
  }

  save(phone: string, code: string, exp: number): void {
    this.codes.set(phone, { code, exp });
  }
}
