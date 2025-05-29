import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '../../../models/order.model';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CartProductDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  addressId: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ type: [CartProductDto] })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CartProductDto)
  products: CartProductDto[];
}
