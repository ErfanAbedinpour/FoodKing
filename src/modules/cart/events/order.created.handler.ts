import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../../order/events/order-created.event';
import { CartService } from '../cart.service';

@Injectable()
export class OrderCreatedHandler {
    constructor(private readonly cartService: CartService) { }

    @OnEvent('order.created')
    async handleOrderCreated(event: OrderCreatedEvent) {
        await this.cartService.clearCart(event.userId);
    }
}

