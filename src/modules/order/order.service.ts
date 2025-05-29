import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderRepository } from './repository/order.repository';
import { CreateOrderDto } from './dtos/create-order.dto';
import { AddressService } from '../address/address.service';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderItem } from '../../models/order-item.model';
import { ErrorMessage } from '../../ErrorMessages/Error.enum';
import { OrderStatus } from '../../models/order.model';
import { ProductService } from '../product/product.service';
import { OrderProductPersist } from './repository/persist/order.persist';

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
    private readonly addressService: AddressService,
    private readonly eventEmitter: EventEmitter2,
    private readonly productService: ProductService,
  ) { }

  async createOrder(
    userId: number,
    { addressId, paymentMethod, products }: CreateOrderDto,
  ) {
    const address = await this.addressService.findOne(userId, addressId);
    console.log('address', address);

    const orderProducts: OrderProductPersist[] = [];

    //TODO: Here should be optimized later.
    //TODO: Here we can Get Entire Product at once
    for (const { productId, quantity } of products) {
      const product = await this.productService.getProductById(productId);
      if (product.inventory < quantity)
        throw new BadRequestException(ErrorMessage.PRODUCT_OUT_OF_STOCK)

      orderProducts.push({ product, quantity });
    }

    // console.log('orderProducts ', orderProducts);

    try {
      const order = await this.orderRepository.createOrder({
        addressId: addressId,
        products: orderProducts,
        paymentMethod,
        userId,
      });

      // TODO: Here should be optimized later.
      // Emit order created event
      const orderItems = orderProducts.map(({ product, quantity }) => {
        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.order = order;
        orderItem.quantity = quantity;
        orderItem.price = product.price;
        return orderItem;
      });

      this.eventEmitter.emit(
        'order.created',
        new OrderCreatedEvent(orderItems, userId),
      );

      return order;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getOrders(userId: number) {
    const orders = await this.orderRepository.getAllUserOrder(userId);
    return orders;
  }

  async getOrderById(userId: number, orderId: number) {
    const order = await this.orderRepository.getUserOrder(userId, orderId);
    if (!order) throw new NotFoundException(ErrorMessage.ORDER_NOT_FOUND);

    return order;
  }

  async deleteOrder(userId: number, orderId: number) {
    const order = await this.getOrderById(userId, orderId);
    if (order.status !== OrderStatus.Processing)
      throw new BadRequestException(ErrorMessage.ORDER_CANNOT_BE_REMOVED);

    try {
      await this.orderRepository.deleteOrder(orderId);
      return;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
