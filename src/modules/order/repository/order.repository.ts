import { Loaded } from '@mikro-orm/core';
import { CartProduct, Order, OrderItem, Product } from '../../../models';
import { OrderPersist } from './persist/order.persist';
import { OrderStatus } from '../../../models/order.model';

export abstract class OrderRepository {
  abstract createOrder(order: OrderPersist): Promise<Loaded<Order>>;
  abstract getAllUserOrder(userId: number): Promise<Order[]>
  abstract getOrderById(orderId: number): Promise<Loaded<Order> | null>
  abstract getUserOrder(userId: number, orderId: number): Promise<Loaded<Order> | null>
  abstract cancleOrder(orderId: number): Promise<void>
  abstract updateOrderStatus(orderId: number, status: OrderStatus): Promise<Loaded<Order>>
}
