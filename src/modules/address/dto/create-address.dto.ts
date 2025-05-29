import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  zipCode!: string;
}
