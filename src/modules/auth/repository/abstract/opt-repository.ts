import { IOtp } from '../../application/interfaces/otp';

export abstract class OtpRepository {
  abstract findOtp(phone: string): IOtp | undefined;
  abstract save(phone: string, code: string, exp: number): void;
  abstract del(phone: string): void;
}
