import { Loaded } from '@mikro-orm/core';
import { CartProduct, Order, Product } from '../../../models';
import { OrderPersist } from './persist/order.persist';

export abstract class OrderRepository {
  abstract createOrder(order: OrderPersist): Promise<Loaded<Order>>;
  abstract getAllUserOrder(userId: number): Promise<Order[]>
  abstract getOrderById(orderId: number): Promise<Loaded<Order> | null>
  abstract deleteOrder(orderId: number): Promise<Order>
}
