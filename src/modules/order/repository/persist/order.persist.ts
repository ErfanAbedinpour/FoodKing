import { CartProduct } from '../../../../models';
import { PaymentMethod } from '../../../../models/order.model';

export class OrderPersist {
  addressId: number;

  userId: number;

  products: CartProduct[];

  paymentMethod: PaymentMethod;
}
