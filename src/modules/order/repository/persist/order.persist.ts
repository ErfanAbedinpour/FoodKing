import { Product } from '../../../../models';
import { PaymentMethod } from '../../../../models/order.model';

export class OrderProductPersist {
  product: Product;
  quantity: number;
}

export class OrderPersist {
  addressId: number;

  userId: number;

  products: OrderProductPersist[];

  paymentMethod: PaymentMethod;
}
