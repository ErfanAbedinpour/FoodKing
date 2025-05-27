import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../../order/events/order-created.event';
import { ProductService } from '../product.service';

@Injectable()
export class OrderCreatedHandler {
  constructor(private readonly productService: ProductService) {}

  @OnEvent('order.created')
  async handleOrderCreated(event: OrderCreatedEvent) {
    for (const item of event.orderItems) {
      await this.productService.updateInventory(item.product.id, item.quantity);
    }
  }
}
