import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Min,
  Max,
} from 'class-validator';
import Decimal from 'decimal.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDTO {
  @ApiProperty({ example: 'burger' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'burger' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  inventory: number;

  @ApiProperty({ type: 'string', example: [1, 2, 3], isArray: true })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => {
    console.log('value is ', value);
    if (typeof value === 'string')
      return value.split(',').map((v) => Number(v.trim()));
    if (Array.isArray(value)) return value.map((v) => Number(v));

    return value;
  })
  categories: number[];

  @ApiProperty({ type: 'string', example: '1200000' })
  @IsNumberString()
  @IsNotEmpty()
  @Type(() => Decimal)
  price: Decimal;

  @ApiProperty({
    description:
      'This burger was created with the best materials. The taste is perfect!',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  restaurant_id: number;


  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  rating: number
}
