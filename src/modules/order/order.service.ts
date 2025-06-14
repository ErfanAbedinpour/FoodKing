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
    await this.addressService.findOne(userId, addressId);

    const orderProducts: OrderProductPersist[] = [];

    //TODO: Here should be optimized later.
    //TODO: Here we can Get Entire Product at once
    for (const { productId, quantity } of products) {
      const product = await this.productService.getProductById(productId);
      if (product.inventory < quantity)
        throw new BadRequestException(ErrorMessage.PRODUCT_OUT_OF_STOCK)

      orderProducts.push({ productId: product.id, price: product.price, quantity });
    }

    try {
      const order = await this.orderRepository.createOrder({
        addressId: addressId,
        products: orderProducts,
        paymentMethod,
        userId,
      });

      this.eventEmitter.emit(
        'order.created',
        new OrderCreatedEvent(orderProducts.map(({ productId, quantity }) => ({ productId, quantity })), userId),
      );

      return { orderId: order.id }
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getOrders(userId: number) {
    const orders = await this.orderRepository.getAllUserOrder(userId);
    return orders;
  }

  async getUserOrderById(userId: number, orderId: number) {
    const order = await this.orderRepository.getUserOrderById(userId, orderId);
    if (!order) throw new NotFoundException(ErrorMessage.ORDER_NOT_FOUND);

    return order;
  }

  async getOrderById(orderId: number) {
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) throw new NotFoundException(ErrorMessage.ORDER_NOT_FOUND);

    return order;
  }

  async cancleOrder(userId: number, orderId: number) {
    const order = await this.orderRepository.getUserOrderById(userId, orderId);
    if (!order)
      throw new NotFoundException(ErrorMessage.ORDER_NOT_FOUND);

    if (order.status !== OrderStatus.Processing)
      throw new BadRequestException(ErrorMessage.ORDER_CANNOT_BE_REMOVED);

    try {
      await this.orderRepository.cancleOrder(orderId);
      return;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
