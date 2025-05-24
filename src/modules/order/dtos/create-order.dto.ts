import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentMethod } from '../../../models/order.model';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  addressId: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
