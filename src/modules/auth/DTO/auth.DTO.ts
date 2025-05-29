import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDTO {
  @ApiProperty({ minLength: 3 })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'name cannot less than 3 character' })
  name: string;

  @ApiProperty({ description: 'The Iran Phone Number', example: '0911000000' })
  @IsNotEmpty()
  @IsPhoneNumber('IR', { message: 'phone is invalid.' })
  phone: string;

  @ApiProperty({})
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsNotEmpty()
  @MinLength(8, { message: 'password cannot less than 8 character' })
  password: string;
}
