import Decimal from 'decimal.js';
import { Product } from '../../../../models';
import { PaymentMethod } from '../../../../models/order.model';

export class OrderProductPersist {
  productId: number;
  price: Decimal;
  quantity: number;
}

export class OrderPersist {
  addressId: number;

  userId: number;

  products: OrderProductPersist[];

  paymentMethod: PaymentMethod;
}
