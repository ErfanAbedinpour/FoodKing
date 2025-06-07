import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'The street of the address',
    example: '123 Main St',
  })
  @IsString()
  @IsNotEmpty()
  street!: string;

  @ApiProperty({
    description: 'The city of the address',
    example: 'New York',
  })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({
    description: 'The state of the address',
    example: 'NY',
  })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty({
    description: 'The country of the address',
    example: 'USA',
  })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({
    description: 'The zip code of the address',
    example: '10001',
  })
  @IsString()
  @IsNotEmpty()
  zipCode!: string;
}
