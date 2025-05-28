import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderRepository } from './repository/order.repository';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CartService } from '../cart/cart.service';
import { AddressService } from '../address/address.service';
import { OrderStatus, PaymentMethod } from '../../models/order.model';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderItem } from '../../models/order-item.model';

/**
 *
 * POST /api/v1/order
 * {
 *    paymentMethod = "Catch" | "online"
 *    addressId
 *
 * }
 * if Payment method is Online =>{
 *      1. Create Order  => status=Waiting for payment
 *      2. Create Payment URL
 *      3. After Payment is Complete Product Status should changed to Processing.
 *      4. Emit OrderCreated Event
 * }
 * if Payment method is catch => OrderCreated  and set status to Processing=> Emit Order.created Event For Decrease product quantity
 */

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async createOrder(
    userId: number,
    { addressId, paymentMethod }: CreateOrderDto,
  ) {
    const [userCartProducts, _] = await Promise.all([
      this.cartService.getCart(userId),
      this.addressService.findOne(userId, addressId),
    ]);
    console.log('userCartProducts', userCartProducts);

    try {
      const order = await this.orderRepository.createOrder({
        addressId: addressId,
        products: userCartProducts.data,
        paymentMethod,
        userId,
      });
      console.log('order', order);

      // Clear the cart after successful order creation
      await this.cartService.clearCart(userId);
      // Emit order created event
      const orderItems = userCartProducts.data.map((product) => {
        const orderItem = new OrderItem();
        orderItem.product = product.product;
        orderItem.order = order;
        orderItem.quantity = product.count;
        orderItem.price = product.product.price;
        return orderItem;
      });

      console.log('orderItems', orderItems);
      this.eventEmitter.emit(
        'order.created',
        new OrderCreatedEvent(orderItems),
      );

      return order;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  getOrders(userId: number) {
    return 'getOrders';
  }

  getOrderById(orderId: number, id: string) {
    return `getOrderById ${id}`;
  }
}
