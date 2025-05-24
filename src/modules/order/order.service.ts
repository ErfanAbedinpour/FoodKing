import { Injectable } from '@nestjs/common';
import { OrderRepository } from './repository/order.repository';
import { CreateOrderDto } from './dtos/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  createOrder(userId: number, { addressId, paymentMethod }: CreateOrderDto) {
    /**
     * TODO: If PaymentMethod is Online, create a payment Link
     * TODO: If PaymentMethod is Cash, create a An Order with status Processing
     */
    return 'createOrder';
  }

  getOrders() {
    return 'getOrders';
  }

  getOrderById(id: string) {
    return `getOrderById ${id}`;
  }
}
