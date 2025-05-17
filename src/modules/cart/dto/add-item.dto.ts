import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddItemDto {
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
