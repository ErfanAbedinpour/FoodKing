import { Loaded } from '@mikro-orm/core';
import { CartProduct, Order, Product } from '../../../models';
import { OrderPersist } from './persist/order.persist';

export abstract class OrderRepository {
  abstract createOrder(order: OrderPersist): Promise<Loaded<Order>>;
}
