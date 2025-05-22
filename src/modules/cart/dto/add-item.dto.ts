import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
