import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddItemDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({})
  productId: number;
}
