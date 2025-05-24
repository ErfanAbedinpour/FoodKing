import { Injectable } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  createOrder(userId: number) {
    return 'createOrder';
  }

  getOrders() {
    return 'getOrders';
  }

  getOrderById(id: string) {
    return `getOrderById ${id}`;
  }
}
