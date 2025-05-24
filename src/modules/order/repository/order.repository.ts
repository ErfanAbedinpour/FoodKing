import { CartProduct, Product } from '../../../models';
import { OrderPersist } from './persist/order.persist';

export abstract class OrderRepository {
  abstract createOrder(order: OrderPersist): Promise<void>;
}
