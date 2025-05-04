import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class VerifyOtpDTO {
  @ApiProperty({ description: 'phone number(IR)' })
  @IsNotEmpty()
  @IsPhoneNumber('IR', { message: 'phone is invalid.' })
  phone: string;

  @ApiProperty({ description: 'Sended OTP Code' })
  @IsNotEmpty()
  code: string;
}
