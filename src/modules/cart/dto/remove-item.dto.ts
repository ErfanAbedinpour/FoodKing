import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
